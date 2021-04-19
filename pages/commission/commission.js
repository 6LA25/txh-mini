// pages/commission/commission.js
const app = getApp()
import { getUserDetail, fetchTicket } from '../../utils/util'
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    pageSize: 20,
    loading: false,
    commissionList: [],
    totalCount: '',
    currentFilter: '',
    totalInfo: null,
    filterList: [{
        value: -1,
        name: '全部佣金'
      },
      {
        value: 1,
        name: '待发放佣金'
      },
      {
        value: 2,
        name: '已发放佣金'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    let userInfo = await getUserDetail(app)
    console.log('userInfo', userInfo)
    let ticket = await fetchTicket(app)
    console.log('ticket', ticket)
    console.log(options)
    this.setData({
      currentFilter: options.status / 1
    }, () => {
      this.fetchTotal()
      this.fetchCommissions()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.fetchCommissions()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  fetchTotal() {
    Fetch({}, URL.commission, app).then(({data}) => {
      this.setData({
        totalInfo: data.item
      })
    })
  },
  // 筛选事件
  handleFilter(e) {
    console.log(e)
    let index = e.currentTarget.dataset.value / 1
    this.setData({
      currentFilter: index
    }, () => {
      this.data.pageNo = 1
      this.data.commissionList = []
      this.fetchCommissions()
    })
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
      status: this.data.currentFilter
    }, URL.commissionItems, app).then(({ data }) => {
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
})