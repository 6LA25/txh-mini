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
    sysUserInfo: null,
    contactList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.event.on('listenContactList1', (conversationList) => {
      console.log('conversationList=>', conversationList)
      this.setData({
        contactList: conversationList
      })
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
   async onShow() {
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

  },
  initRecentContactList() {
    let promise = app.globalData.$tim.getConversationList()
    promise.then((imResponse) => {
      console.log('会话列表=>', imResponse)
      this.setData({
        contactList: imResponse.data.conversationList
      })
    })
  },
})