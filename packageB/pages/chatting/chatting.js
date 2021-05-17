// pages/Secondary/pages/chatting/chatting.js
const app = getApp()
import { Fetch } from '../../../utils/http'
import { getUserDetail, fetchTicket } from '../../../utils/util'
import URL from '../../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    height: '',
    userId: 'TXH1591352906175',
    // userId: 'TXH1591352795921',
    messages: [
      // {text: 1},
      // {text: 1},
      // {text: 1},
      // {text: 1},
      // {text: 1},
      // {text: 1},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await getUserDetail(app)
    await fetchTicket(app)
    this.listenTim()
    // let { data } = await Fetch({ userid: 'TXH1591352795921' }, URL.tim, app)
    // // 开始登录
    // let { $tim } = app.globalData
    // let timLogin = $tim.login({
    //   userID: 'TXH1591352795921',
    //   userSig: data.userSig,
    // })
    // timLogin.then((imResponse) => {
    //   if (imResponse.data.repeatLogin === true) {
    //     // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
    //     console.log('imResponse.data.errorInfo', imResponse.data.errorInfo)
    //   }
    //   console.log('imResponse==>', imResponse)
    //   this.listenTim()
    // }).catch(function (imError) {
    //   console.warn('login error:', imError) // 登录失败的相关信息
    // })
    this.setData({
      height: wx.getSystemInfoSync().windowHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  listenTim() {
    let tim = app.globalData.$tim
    const TIM = app.globalData.$$TIM
    console.log('TIM.EVENT.SDK_READY', TIM.EVENT.SDK_READY)
    // 监听事件，例如：
    console.log('TIM.EVENT.SDK_READY', TIM.EVENT.SDK_READY)
    // tim.on(TIM.EVENT.SDK_READY, function (event) {
    //   // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
    //   // event.name - TIM.EVENT.SDK_READY
    // })
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
      console.log('MESSAGE_RECEIVED=>', event.data)
      // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
      // event.name - TIM.EVENT.MESSAGE_RECEIVED
      // event.data - 存储 Message 对象的数组 - [Message]
    })
    tim.on(TIM.EVENT.MESSAGE_REVOKED, function (event) {
      // 收到消息被撤回的通知
      // event.name - TIM.EVENT.MESSAGE_REVOKED
      // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
    })
    tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, function (event) {
      // SDK 收到对端已读消息的通知，即已读回执。使用前需要将 SDK 版本升级至 v2.7.0 或以上。仅支持单聊会话。
      // event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
      // event.data - event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
    })
    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
      console.log('CONVERSATION_LIST_UPDATED=>', event.data)
      // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
      // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
      // event.data - 存储 Conversation 对象的数组 - [Conversation]
    })
    tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function (event) {
      // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
      // event.name - TIM.EVENT.GROUP_LIST_UPDATED
      // event.data - 存储 Group 对象的数组 - [Group]
    })
    tim.on(TIM.EVENT.PROFILE_UPDATED, function (event) {
      // 收到自己或好友的资料变更通知
      // event.name - TIM.EVENT.PROFILE_UPDATED
      // event.data - 存储 Profile 对象的数组 - [Profile]
    })
    tim.on(TIM.EVENT.BLACKLIST_UPDATED, function (event) {
      // 收到黑名单列表更新通知
      // event.name - TIM.EVENT.BLACKLIST_UPDATED
      // event.data - 存储 userID 的数组 - [userID]
    })
    tim.on(TIM.EVENT.ERROR, function (event) {
      console.log('TIM.EVENT.ERROR', event)
      // 收到 SDK 发生错误通知，可以获取错误码和错误信息
      // event.name - TIM.EVENT.ERROR
      // event.data.code - 错误码
      // event.data.message - 错误信息
    })
    tim.on(TIM.EVENT.SDK_NOT_READY, function (event) {
      // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
      // event.name - TIM.EVENT.SDK_NOT_READY
    })
    tim.on(TIM.EVENT.KICKED_OUT, function (event) {
      // 收到被踢下线通知
      // event.name - TIM.EVENT.KICKED_OUT
      // event.data.type - 被踢下线的原因，例如:
      //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
      //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
      //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢 （v2.4.0起支持）。
    })
    tim.on(TIM.EVENT.NET_STATE_CHANGE, function (event) {
      //  网络状态发生改变（v2.5.0 起支持）。
      // event.name - TIM.EVENT.NET_STATE_CHANGE
      // event.data.state 当前网络状态，枚举值及说明如下：
      //     \- TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
      //     \- TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
      //    \- TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
    })
  },
  //获取普通文本消息
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 发送普通文本消息
  bindConfirm(e) {
    const {$tim} = app.globalData
    const {$$TIM} = app.globalData
    var content = this.data.inputValue
    console.log('send message=>', content)
    // 发送文本消息
    let message = $tim.createTextMessage({
      to: 'TXH1582522953117',
      conversationType: $$TIM.TYPES.CONV_C2C,
      payload: {
        text: content
      }
    });
    // 2. 发送消息
    let promise = $tim.sendMessage(message);
    promise.then(function (imResponse) {
      // 发送成功
      console.log(imResponse);
    }).catch(function (imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
    });
  },
})