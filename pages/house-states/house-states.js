// pages/house-states/house-states.js
const app = getApp()
const QQMapWX = require('../../common/sdk/qqmap-wx-jssdk.min.js')
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseId: '',
    pageNo: 1,
    pageSize: 10,
    loading: false,
    commissionList: [],
    totalCount: '',
    type: '1',
    filterList: [{
      value: '1',
      name: '楼盘动态'
    },
    {
      value: '2',
      name: '开盘信息'
    },
    {
      value: '3',
      name: '交房信息'
    },
    {
      value: '4',
      name: '证件信息'
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.name)
    })
    this.setData({
      houseId: options.id
    })
    this.fetchCommissions()
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
    this.fetchCommissions()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  fetchCommissions() {
    if (this.data.loading) {
      return
    }
    if (this.data.commissionList.length === this.data.totalCount && this.data.totalCount > 0) {
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
      pageSize: this.data.pageSize,
      houseId: this.data.houseId,
      type: this.data.type / 1
    }, URL.trends, app).then(({ data }) => {
      let commissionList = this.data.commissionList
      commissionList.push(...data.items)
      this.setData({
        commissionList,
        totalCount: data.totalCount,
        loading: false
      })
      if (commissionList.length < data.totalCount) {
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
  // 筛选事件
  handleFilteList(e) {
    this.setData({
      type: e.currentTarget.dataset.type
    }, () => {
      this.data.pageNo = 1
      this.data.commissionList = []
      this.fetchCommissions()
    })
  },
})