// pages/index/index.js
import { Fetch } from '../../utils/http'
import { getUserDetail, fetchTicket } from '../../utils/util'
import URL from '../../utils/url'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null, // 微信授权信息
    sysUserInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    locationInfo: null,
    bannerList: [],
    houseFilter: 0,
    housesList: [],
    noticeList: [],
    totalHouses: '',
    notice: {}, // 通知公告
    pageData: {
      pageNo: 1,
      pageSize: 8,
      module: 'index'
    },
    loadingHouses: false,
    hasAuth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // this.initAllData()
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
    console.log('index show')
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    if (app.globalData.hasClickAuth && !this.data.hasAuth) {
      this.setData({
        hasAuth: true
      })
    }
    if (app.globalData.userInfo && !this.data.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    // 授权后更新tab经纪人状态
    if (app.globalData.sysUserInfo) {
      this.getTabBar().setData({
        agentUser: app.globalData.sysUserInfo.agentUser
      })
    }
    this.initAllData()
    // wx.hideTabBar()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('hide')
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
    console.log('end')
    // this.fetchHouses()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log(e)
    if (e.from === 'button') {
      let id = e.target.dataset.id
      let name = e.target.dataset.name
      let cover = e.target.dataset.cover
      Fetch({
        houseId: id
      }, URL.addShareCount, app).then(({ data }) => { })
      return {
        title: name,
        path: `/pages/house-detail/index?id=${id}&inviteCode=${app.globalData.sysUserInfo.userCode}&inviteMobile=${app.globalData.sysUserInfo.phoneNumber}`,
        imageUrl: cover
      }
    }
  },
  handleJumpClause(e) {
    let tag = e.currentTarget.dataset.tag
    wx.navigateTo({
      url: '/pages/Secondary/pages/clause/clause?tag=' + tag
    })
  },
  async initAllData() {
    // 加入回调方法，更新用户具体当前位置
    console.log('init index alldata')
    wx.hideShareMenu();
    console.log('index page onload')
    // 暂时注释地址获取
    if (app.globalData.locationInfo) {
      this.setData({
        locationInfo: app.globalData.locationInfo
      })
    } else {
      app.locationInfoReadyCallback = res => {
        this.setData({
          locationInfo: res,
        })
      }
    }
    let userInfo = await getUserDetail(app)
    console.log('userInfo', userInfo)
    let ticket = await fetchTicket(app)
    console.log('ticket', ticket)
    this.setData({
      userInfo: app.globalData.userInfo,
      sysUserInfo: app.globalData.sysUserInfo,
      hasAuth: app.globalData.hasClickAuth
    })
    // 更新tabbar是否为经纪人
    this.getTabBar().setData({
      agentUser: app.globalData.sysUserInfo.agentUser
    })
    // 未点击过隐私协议
    if (app.globalData.sysUserInfo.agreement / 1 !== 1) {
      return
    }
    // 获取banner数据
    this.fetchBanner()
    // 获取公告
    this.fetchNotice()
    this.fetchHouses()
  },
  fetchHouses() {
    wx.showLoading({
      title: '加载中',
    })
    Fetch(this.data.pageData, URL.hotHouses, app).then(({ data }) => {
      this.setData({
        housesList: data.items
      })
      wx.hideLoading()
    }).catch(error => {
      console.log(error)
    })
  },
  fetchBanner() {
    Fetch({
      num: 5
    }, URL.banner, app).then(({ data }) => {
      if (data.items.length > 0) {
        this.setData({
          bannerList: data.items
        })
      }
    }).catch(error => {
      console.log(error)
    })
  },
  fetchNotice() {
    Fetch({
      pageNo: 1,
      pageSize: 5
    }, URL.notice, app).then(({ data }) => {
      if (data.items) {
        this.setData({
          notice: data.items[0],
          noticeList: data.items
        })
      }
    }).catch(error => {
      console.log(error)
    })
  },
  handleFilterHouse(e) {
    console.log(e.currentTarget.dataset.index, this.data.houseFilter)
    if (e.currentTarget.dataset.index / 1 === this.data.houseFilter || this.data.loadingHouses) {
      return
    }
    this.setData({
      housesList: [],
      totalHouses: '',
      houseFilter: e.currentTarget.dataset.index / 1,
      ['pageData.pageNo']: 1
    }, () => {
      console.log(this.data.houseFilter)
      this.fetchHouses()
    })
  },
  handleJumpMoreHouse() {
    wx.switchTab({
      url: '../houses/houses'
    })
  },
  handleJumpMapHouses() {
    wx.navigateTo({
      url: '../Secondary/pages/map-houses/index'
    })
  },
  handleJumpSearch() {
    wx.navigateTo({
      url: '../search-house/search-house'
    })
  },
  // 分享前授权
  onMyEvent(e) {
    this.setData({
      hasAuth: true
    })
  },
  handleJumpNotices() {
    wx.navigateTo({
      url: '../Secondary/pages/notices/notices'
    })
  },
  stopTouchMove() {
    return false;
  },
  handleJumpFocusHouses() {
    wx.navigateTo({
      url: '../houses-focus/houses-focus'
    })
  },
  // 确定点击同意隐私
  handleComfirmPolicy() {
    this.setData({
      'sysUserInfo.agreement': 1
    })
    Fetch({}, URL.policyAgree, app).then(({ data }) => {
      app.globalData.sysUserInfo = null
      app.globalData.userInfo = null
      app.globalData.ticket = ''
      this.initAllData()
    }).catch(error => {
    })
  }
})