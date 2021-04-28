// pages/Secondary/pages/consult-online/consult.js
const app = getApp()
import { Fetch } from '../../utils/http'
import { getUserDetail, fetchTicket } from '../../utils/util'
import URL from '../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysUserInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
   async onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
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

  }
})