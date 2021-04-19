// pages/personal-info/personal-info.js
const app = getApp()
import { _asyncUserInfo } from '../../utils/util'
import QQMapWX from '../../common/sdk/qqmap-wx-jssdk.min'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.sysUserInfo
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
  // wx api绑定button获取用户信息
  getUserInfo: async function (e) {
    console.log('授权获取用户信息：', e)
    // app.globalData.ticket = ''
    let userInfo = null
    // 点击确认后重新授权同步信息
    if (e.detail.rawData) {
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.encryptedData = e.detail.encryptedData
      app.globalData.ivStr = e.detail.iv
      await _asyncUserInfo(app)
      wx.showToast({
        title: '同步信息成功',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        userInfo: app.globalData.sysUserInfo
      })
    }
  }
})