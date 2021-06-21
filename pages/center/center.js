//logs.js
const app = getApp()
import { Fetch } from '../../utils/http'
import { getTrafficData, getUserDetail, fetchTicket } from '../../utils/util'
import URL from '../../utils/url'
Page({
  data: {
    sysUserInfo: null,
    callShow: false
  },
  async onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let userInfo = await getUserDetail(app)
    let ticket = await fetchTicket(app)
    let sysUserInfo = await Fetch({}, URL.userInfo, app)
    app.globalData.sysUserInfo = sysUserInfo.data
    this.setData({
      sysUserInfo: app.globalData.sysUserInfo
    })
    // 更新tabbar是否为经纪人
    this.getTabBar().setData({
      agentUser: app.globalData.sysUserInfo.agentUser
    })
    wx.hideLoading()
  },
  onLoad: function () {
  },
  handleJumpCommission(e) {
    let status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: `../commission/commission?status=${status}`
    })
  },
  handleJumpCustomer() {
    wx.navigateTo({
      url: '../my-customer/my-customer'
    })
  },
  handleJumpBroker() {
    wx.navigateTo({
      url: '../develop-broker/develop-broker'
    })
  },
  handleJumpGuide() {
    wx.navigateTo({
      url: '../recommend-guide/recommend-guide'
    })
  },
  handleRecommend() {
    wx.navigateTo({
      url: '/pages/Secondary/pages/recommend-desc/recommend-desc'
    })
  },
  handleJumpCenter() {
    wx.navigateTo({
      url: '../personal-info/personal-info'
    })
  },
  handleApplyBroker() {
    wx.navigateTo({
      url: '../apply-broker/apply-broker'
    })
  },
  handleJumpAlipay() {
    // 改为绑定银行卡
    wx.navigateTo({
      url: '/pages/Secondary/pages/bind-alipay/bind-alipay'
    })
  },
  handleJumpAccountBalance() {
    wx.navigateTo({
      url: '/pages/Secondary/pages/account-balance/index'
    })
  },
  handleLicai() {
    this.selectComponent("#toast").showToast('后续开放，敬请期待');
  },
  handleJumpCommissionRule() {
    wx.navigateTo({
      url: '/pages/Secondary/pages/commission-rule/commission-rule'
    })
  },
  handleMakeCall(e) {
    this.handleConnect()
    wx.makePhoneCall({ //点击确定按钮  调用小程序拨打电话的api  
      phoneNumber: e.currentTarget.dataset.phone,//从后台获取到的电话号码
      success: function () {
        console.log('拨打电话成功' + telephone)
      },
      fail: function (err) {
        console.log("拨打电话失败", err)
      }
    })
  },
  handleConnect() {
    this.setData({
      callShow: !this.data.callShow
    })
  },
  handleJumpSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    })
  }
})
