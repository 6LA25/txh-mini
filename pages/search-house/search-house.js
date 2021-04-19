// pages/search-house/search-house.js
const app = getApp()
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: 10,
    historyList: [],
    hotWords: [],
    search: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.searchText) {
      this.setData({
        search: app.globalData.searchText
      })
    }
    app.globalData.hasSearch = false
    wx.getStorage({
      key: 'search',
      success: (res) => {
        console.log(res.data)
        this.setData({
          historyList: res.data || []
        })
      }
    })
    this.getHotWord()
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
  getHotWord() {
    Fetch({}, URL.hotWord, app).then(({data}) => {
      this.setData({
        hotWords: data.items
      })
    }).catch(error => {})
  },
  handleDeleteHistory() {
    this.setData({
      historyList: []
    }, () => {
      wx.setStorageSync('search', [])
    })
  },
  changeSearch(e) {
    this.setData({
      search: e.detail.value
    })
  },
  handleConfirm(e) {
    this.setData({
      search: e.detail.value
    })
    app.globalData.searchText = e.detail.value
    this.addSearchHistory()
  },
  handleCancel() {
    app.globalData.searchText = ''
    app.globalData.hasSearch = true
    this.setData({
      search: ''
    })
    wx.navigateBack({
      delta: 1
    })
  },
  handleSelectHistory (e) {
    this.setData({
      search: e.currentTarget.dataset.text
    }, () => {
      app.globalData.searchText = e.currentTarget.dataset.text
      this.jumpBack()
    })
  },
  handleSelectHot(e) {
    this.setData({
      search: e.currentTarget.dataset.text
    }, () => {
      app.globalData.searchText = e.currentTarget.dataset.text
      this.addSearchHistory()
    })
  },
  addSearchHistory() {
    let historyList = this.data.historyList
    if (this.data.search) {
      if (historyList.length === this.data.limit) {
        historyList.splice(0, 1)
      }
      if (!historyList.includes(this.data.search)) {
        historyList.push(this.data.search)
      }
    }
    this.setData({
      historyList
    }, () => {
      wx.setStorageSync('search', this.data.historyList)
      this.jumpBack()
    })
  },
  jumpBack() {
    app.globalData.hasSearch = true
    wx.switchTab({
      url: '../houses/houses'
    })
  }
})