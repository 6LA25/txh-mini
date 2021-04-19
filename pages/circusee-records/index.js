// pages/circusee-records/index.js
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    houseId: '',
    totalCount: '',
    userList: [
    ],
    pageNo: 1,
    pageSize: 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      houseId: options.id
    }, () => {
      this.getLogs()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '围观记录'
    })
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
    this.getLogs()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getLogs() {
    Fetch({
      houseId: this.data.houseId,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    }, URL.accesslogs, app).then(({data}) => {
      console.log(1111)
      if (this.data.loading || this.data.userList.length === this.data.totalCount) {
        return
      }
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        loading: true
      })
      let userList = this.data.userList
      userList.push(...data.items)
      this.setData({
        userList,
        totalCount: data.totalCount,
        loading: false
      })
      if (userList.length < data.totalCount) {
        let pageNo = this.data.pageNo
        pageNo = pageNo + 1
        console.log(pageNo)
        this.setData({
          pageNo
        })
      }
      wx.hideLoading()
    })
  }
})