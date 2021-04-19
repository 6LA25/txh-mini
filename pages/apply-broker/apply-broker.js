// pages/apply-broker/apply-broker.js
const app = getApp()
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
import { getUserDetail, fetchTicket } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    mobile: '',
    isLoading: false,
    sysUserInfo: null,
    inviteCode: '',
    par: '',
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log('apply-broker', options)
    let userInfo = await getUserDetail(app)
    let ticket = await fetchTicket(app)
    var pages = getCurrentPages() //获取加载的页面

    var currentPage = pages[pages.length - 1] //获取当前页面的对象

    var url = currentPage.route
    console.log(currentPage.options)
    let inviteCode = ''
    if (options.scene) {
      let scene = decodeURIComponent(options.scene)
      inviteCode = scene.split('=')[1]
    } else {
      inviteCode = options.c || ''
    }
    this.setData({
      mobile: app.globalData.sysUserInfo ? app.globalData.sysUserInfo.phoneNumber : '',
      sysUserInfo: app.globalData.sysUserInfo,
      inviteCode,
      par: JSON.stringify(options),
      url: url + '?c=' + options.c
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
    console.log('show')
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
  handleSubmit() {
    if (!this.data.name) {
      wx.showToast({
        title: '请填写真实姓名',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.mobile) {
      wx.showToast({
        title: '请获取手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '提交中',
    })
    this.setData({
      isLoading: true
    })
    Fetch({
      realname: this.data.name,
      inviteCode: this.data.inviteCode
    }, URL.applyBroker, app).then(({ data }) => {
      console.log(data)
      wx.hideLoading()
      wx.showToast({
        title: '申请成功',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        isLoading: true
      })
      wx.switchTab({
        url: '../center/center'
      })
    }).catch(error => {
      wx.showToast({
        title: error.result_msg,
        icon: 'none',
        duration: 2000
      })
      this.setData({
        isLoading: true
      })
      wx.hideLoading()
    })
  },
  // 获取用户电话号码
  async getPhoneNumber(e) {
    console.log(e)
    if (!e.detail.encryptedData) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    app.globalData.encryptedData = e.detail.encryptedData
    app.globalData.ivStr = e.detail.iv
    app.globalData.ticket = ''
    let { sysInfo } = await fetchTicket(app)
    this.setData({
      mobile: sysInfo.phoneNumber
    }, () => {
      wx.hideLoading()
    })
  },
  bindKeyInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  handleJumpIndex() {
    wx.switchTab({
      url: '../index/index'
    })
  }
})