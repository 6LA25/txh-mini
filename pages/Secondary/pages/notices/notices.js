// pages/notices/notices.js
import { Fetch } from '../../../../utils/http'
import URL from '../../../../utils/url'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 10,
    loading: false,
    noticeList: [],
    totalCount: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchNotice()
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
    this.fetchNotice()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  fetchNotice() {
    if (this.data.loading) {
      return
    }
    if (this.data.noticeList.length === this.data.totalCount) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loading: true
    })
    Fetch({
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    }, URL.notice, app).then(({ data }) => {
      let noticeList = this.data.noticeList
      noticeList.push(...data.items)
      this.setData({
        noticeList,
        totalCount: data.totalCount,
        loading: false
      })
      if (noticeList.length < data.totalCount) {
        let pageNo = this.data.pageNo
        pageNo = pageNo + 1
        console.log(pageNo)
        this.setData({
          pageNo
        })
      }
      wx.hideLoading()
    }).catch(error => {
      console.log(error)
    })
  },
})