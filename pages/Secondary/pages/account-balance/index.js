// pages/Secondary/pages/account-balance/index.js.js
const app = getApp()
import { Fetch } from '../../../../utils/http'
import URL from '../../../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amountDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCommissionDetail()
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
  getCommissionDetail() {
    Fetch({}, URL.commission, app).then(({ data }) => {
      console.log(data)
      this.setData({
        amountDetail: data.item
      })
    })
  },
  handleJumpCommission(e) {
    let status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: `/pages/commission/commission?status=${status}`
    })
  },
  handleWithdraw() {
    wx.navigateTo({
      url: '/pages/Secondary/pages/withdraw-deposit/index'
    })
  }
})