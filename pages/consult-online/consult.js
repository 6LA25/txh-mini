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
    contactList: [],
    newest: null,
    sysMsg: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.event.on('listenContactList', (conversationList) => {
      console.log('conversationList=>', conversationList)
      this.setData({
        contactList: conversationList
      })
    })
    this.getNewest()
    this.getSys()
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
    wx.event.off('listenContactList')
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
  async handleJumpChatting (e) {
    console.log(e.currentTarget.dataset.chat)
    let { chat } = e.currentTarget.dataset
    if (chat.unreadCount > 0) {
      await app.globalData.$tim.setMessageRead({ conversationID: chat.conversationID })
    }
    wx.navigateTo({
      url: `/packageB/pages/chatting/chatting?conversationID=${chat.conversationID}&userID=${chat.userProfile.userID}&conversationType=${chat.type}&nick=${chat.userProfile.nick || chat.userProfile.userID}`
    })
  },
  handleJumpSysMsg() {
    wx.navigateTo({
      url: '../Secondary/pages/notices/notices'
    })
  },
  getNewest() {
    Fetch({}, URL.newest, app).then(({data}) => {
      this.setData({
        newest: data || null
      })
    })
  },
  getSys() {
    Fetch({}, URL.sysItem, app).then(({data}) => {
      this.setData({
        sysMsg: data || null
      })
    })
  },
  handleJumpNewst() {
    wx.navigateTo({
      url: '../../packageB/pages/newest/news'
    })
  }
})