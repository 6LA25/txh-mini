// pages/develop-broker/develop-broker.js
const app = getApp()
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentFilter: 0,
    pageNo: 1,
    pageSize: 10,
    filterList: [{
      value: 0,
      name: '我邀请的下线',
      count: 0
    },
    {
      value: 1,
      name: '我的下线邀请',
      count: 0
    }
    ],
    aList: [],
    totalCount: '',
    totalAgent: '',
    loading: false,
    myCount: 0,
    subCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyAgents()
    this.getAllAgentNum()
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
  getAllAgentNum() {
    Fetch({}, URL.totalAgent, app).then(({data}) => {
      let filterList = this.data.filterList
      filterList[0].count = data.item.myCount
      filterList[1].count = data.item.subCount
      this.setData({
        totalAgent: data.totalCount,
        filterList
      })
    })
  },
  // 筛选事件
  handleFilter(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    if (index === this.data.index || this.data.loading) {
      return
    }
    this.setData({
      currentFilter: index
    }, () => {
      this.getMyAgents(this.resetFetch)
    })
  },
  getMyAgents(reset) {
    if (this.data.loading) {
      return
    }
    if (reset) {
      reset()
    }
    if (this.data.aList.length === this.data.totalCount) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loading: true
    })
    let _url = ''
    if (this.data.currentFilter === 0) {
      _url = URL.myagent
    } else if (this.data.currentFilter === 1) {
      _url = URL.subAgent
    }
    Fetch({
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    }, _url, app).then(({data}) => {
      let aList = this.data.aList
      aList.push(...data.items)
      this.setData({
        aList,
        totalCount: data.totalCount,
        loading: false
      })
      if (aList.length < data.totalCount) {
        let pageNo = this.data.pageNo
        pageNo = pageNo + 1
        this.setData({
          pageNo
        })
      }
      wx.hideLoading()
    })
  },
  resetFetch() {
    this.setData({
      pageNo: 1,
      totalCount: '',
      aList: []
    })
  },
  handleCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile //仅为示例，并非真实的电话号码
    })
  }
})