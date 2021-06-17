// packageB/pages/apply-activity/apply.js
import { Fetch } from '../../../utils/http'
import { getUserDetail, fetchTicket } from '../../../utils/util'
import URL from '../../../utils/url'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    visible_0: false,
    visible_1: false,
    visible_2: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    await getUserDetail(app)
    await fetchTicket(app)
    this.getActivityDetail(options.id)
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
    return {
      title: this.data.detail.name
    }
  },

  getActivityDetail(registerid) {
    Fetch({
      registerid
    }, URL.applyActivityItem, app).then(({data}) => {
      // let button = data.template.button.split(',')
      // data.template.button = button
      this.setData({
        detail: data,
        visible_0: data.template.button.includes('0'),
        visible_1: data.template.button.includes('1'),
        visible_2: data.template.button.includes('2'),
      })
    })
  },
  handleConnect() {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.template.salescalls // 上级邀请经纪人的电话
    })
  },
  handleJump() {
    wx.navigateTo({
      url: `../apply-form/form?id=${this.data.detail.id}`
    })
  }
})