import { hexMD5 } from './md5'
const QQMapWX = require('../common/sdk/qqmap-wx-jssdk.min.js')
const qqmapsdk = new QQMapWX({
  key: 'UPFBZ-TLSWD-3CY4U-HTWPI-AZ53E-63BTT'
});
import { Fetch } from './http'
import URL from './url'
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 获取登录后code
const fetchCode = () => {
  return new Promise(resolve => {
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        resolve(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  })
}

// 登录 -> 获取用户信息
const fetchTicket = async (app) => {
  if (app.globalData.ticket) {
    initTim(app)
    return
  }
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  let { code } = await fetchCode()
  let userInfo = app.globalData.userInfo || {}
  return new Promise(resolve => {
    Fetch({
      code: code,
      encryptedData: app.globalData.encryptedData,
      ivStr: app.globalData.ivStr,
      wechatNickname: userInfo.nickName,
      wechatAvatar: userInfo.avatarUrl
    }, URL.login, app).then(async ({ data }) => {
      app.globalData.ticket = data.ticket
      // 获取登录后系统用户信息
      let userInfo = await Fetch({}, URL.userInfo, app)
      app.globalData.sysUserInfo = userInfo.data
      // 测试
      // app.globalData.sysUserInfo.agreement = 0
      initTim(app)
      wx.hideLoading()
      resolve({
        loginInfo: {
          ...data
        },
        sysInfo: {
          ...userInfo.data
        }
      })
    })
  })
}
// 同步用户信息
const _asyncUserInfo = async (app) => {
  let { code } = await fetchCode()
  return new Promise((resolve, reject) => {
    Fetch({
      code,
      encryptedData: app.globalData.encryptedData,
      ivStr: app.globalData.ivStr
    }, URL.asyncAccount, app).then(async ({ data }) => {
      // 获取用户信息
      let sysUserInfo = await Fetch({}, URL.userInfo, app)
      app.globalData.sysUserInfo = sysUserInfo.data
      resolve(sysUserInfo.data)
    })
  })
}

const getUserLocation = (app) => {
  if (app.globalData.locationInfo) {
    return
  }
  wx.getLocation({
    type: 'wgs84',
    success: res => {
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function (addressRes) { //成功后的回调
          var addressRes = addressRes.result;
          app.globalData.locationInfo = addressRes
          if (app.locationInfoReadyCallback) {
            app.locationInfoReadyCallback(addressRes)
          }
        },
        fail: function (error) {
          console.error(error);
        },
        complete: function (addressRes) {
          console.log('完成', addressRes);
        }
      })
    },
    fail: function (error) {
      console.error(error);
    }
  })
}

// 登录im
const initTim = async (app) => {
  console.log('sysUserInfo', app.globalData.sysUserInfo)
  // let userId = 'TXH1582522953117'
  // let { data } = await Fetch({ userid: userId }, URL.tim, app)
  let { $tim, $$TIM } = app.globalData
  let timLogin = $tim.login({
    userID: app.globalData.sysUserInfo.imconfig.userId,
    userSig: app.globalData.sysUserInfo.imconfig.userSig,
  })
  timLogin.then((imResponse) => {
    if (imResponse.data.repeatLogin === true) {
      // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
      console.log('imResponse.data.errorInfo', imResponse.data.errorInfo)
    }
    console.log('imResponse==>', imResponse)
    if (!app.globalData.isImLogin) {
      listenTim(app)
    } else {
      initRecentContactList(app)
    }
  }).catch(function (imError) {
    console.warn('login error:', imError) // 登录失败的相关信息
  })
}
const initRecentContactList = (app) => {
  let { $tim, $$TIM } = app.globalData
  let promise = $tim.getConversationList()
  promise.then((imResponse) => {
    console.log('会话列表', imResponse, wx.event)
    const conversationList = imResponse.data.conversationList
    wx.event.emit('listenUnreadMsg', conversationList)
    wx.event.emit('listenContactList', conversationList)
  })
}

const listenTim = async (app) => {
  let { $tim, $$TIM } = app.globalData
  // 监听事件，例如：
  // if (app.globalData.isImLogin) {
  //   initRecentContactList(app)
  // }
  $tim.on($$TIM.EVENT.SDK_READY, (event) => {
    console.log('eve', event)
    app.globalData.isImLogin = true
    // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
    // event.name - TIM.EVENT.SDK_READY
    initRecentContactList(app)
  })
  $tim.on($$TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
    console.log('CONVERSATION_LIST_UPDATED', event.data)
    wx.event.emit('listenUnreadMsg', event.data)
    wx.event.emit('listenContactList', event.data)
    // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
    // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
    // event.data - 存储 Conversation 对象的数组 - [Conversation]
  })
  $tim.on($$TIM.EVENT.MESSAGE_RECEIVED, (event) => {
    console.log('TIM.EVENT.MESSAGE_RECEIVED==>', event.data)
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1]
    if (currentPage.route === 'packageB/pages/chatting/chatting') {
      wx.event.emit('listenReceivedMsg', event.data)
    }
  })
  $tim.on($$TIM.EVENT.MESSAGE_READ_BY_PEER, function (event) {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1]
    // SDK 收到对端已读消息的通知，即已读回执。使用前需要将 SDK 版本升级至 v2.7.0 或以上。仅支持单聊会话。
    // event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
    // event.data - event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
    console.log('TIM.EVENT.MESSAGE_READ_BY_PEER==>', event.data)
    if (currentPage.route === 'packageB/pages/chatting/chatting') {
      wx.event.emit('listenMsgReaded', event.data)
    }
  })
  $tim.on($$TIM.EVENT.MESSAGE_REVOKED, function (event) {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1]
    // 收到消息被撤回的通知
    // event.name - TIM.EVENT.MESSAGE_REVOKED
    // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
    console.log('$$TIM.EVENT.MESSAGE_REVOKED=>', event.data)
    if (currentPage.route === 'packageB/pages/chatting/chatting') {
      wx.event.emit('listenMsgRevoked', event.data)
    }
  })
}

// 获取sk
const fetchSk = (url) => {
  return new Promise(resolve => {
    let str = hexMD5('/ws/geocoder/v1?key=UPFBZ-TLSWD-3CY4U-HTWPI-AZ53E-63BTT&location=28.7033487,115.86608470NZcreemd5GygLiCPNgQ1YqK24CgsJ3')
    console.log(str)
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1?key=UPFBZ-TLSWD-3CY4U-HTWPI-AZ53E-63BTT&location=28.7033487,115.8660847&sig=${str}`,
      method: 'GET',
      data: '',
      success(res) {
        console.log(res)
      }
    })
  })
}

// 获取楼盘周边信息
const getTrafficData = (opts) => {
  return new Promise((resolve, reject) => {
    qqmapsdk.search({
      page_size: 20,
      keyword: opts.keyword,
      //搜索关键词
      location: `${opts.latitude},${opts.longitude}`,
      //设置周边搜索中心点
      success: function (res) { //搜索成功后的回调
        resolve(res)
      },
      fail: function (res) {
        // console.log(res);
        resolve(res)
      },
      complete: function (res) {
      }
    });
  })
}
// 获取用户信息
const getUserDetail = async (app) => {
  if (!wx.canIUse('button.open-type.getUserInfo')) {
    wx.getUserInfo({
      success: res => {
        resolve(res.userInfo)
      },
      fail: () => {
        resolve(null)
      }
    })
    return
  }
  return new Promise((resolve, reject) => {
    // 获取用户信息
    if (app.globalData.userInfo) {
      resolve(app.globalData.userInfo)
      return
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              app.globalData.userInfo = res.userInfo
              app.globalData.encryptedData = res.encryptedData
              app.globalData.ivStr = res.iv
              app.globalData.hasClickAuth = true
              resolve(res.userInfo)
            },
            fail: () => {
              resolve(null)
            }
          })
        } else {
          resolve(null)
        }
      },
      fail: () => {
        resolve(null)
      }
    })
  })
}
module.exports = {
  formatTime: formatTime,
  getUserLocation,
  getTrafficData,
  fetchCode,
  getUserDetail,
  fetchTicket,
  _asyncUserInfo,
  fetchSk
}