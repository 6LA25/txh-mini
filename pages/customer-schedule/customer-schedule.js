// pages/customer-schedule/customer-schedule.js
const app = getApp()
import { Fetch } from '../../utils/http'
import { getUserDetail, fetchTicket } from '../../utils/util'
import URL from '../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark: '',
    remarkList: [],
    timeLine: [],
    pageNo: 1,
    pageSize: 5,
    customerId: '',
    customerDetail: null,
    submitting: false,
    totalCount: '',
    loadingRemark: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    let userInfo = await getUserDetail(app)
    console.log('userInfo', userInfo)
    let ticket = await fetchTicket(app)
    console.log('ticket', ticket)
    this.setData({
      customerId: options.id
    }, () => {
      this.getCustomerDetail()
      this.getAllRemark()
      this.getAllTimeLine()
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
    this.getAllRemark()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getAllTimeLine() {
    Fetch({
      customerId: this.data.customerId
    }, URL.timeLine, app).then(({ data }) => {
      this.setData({
        timeLine: data.items
      })
    })
  },
  getAllRemark(reset) {
    if (this.data.loadingRemark) {
      return
    }
    if (reset) {
      reset()
    }
    if (this.data.remarkList.length === this.data.totalCount) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loadingRemark: true
    })
    Fetch({
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      customerId: this.data.customerId
    }, URL.followItems, app).then(({ data }) => {
      let remarkList = this.data.remarkList
      remarkList.push(...data.items)
      this.setData({
        remarkList,
        totalCount: data.totalCount,
        loadingRemark: false
      })
      console.log(111111)
      if (remarkList.length < data.totalCount) {
        let pageNo = this.data.pageNo
        pageNo = pageNo + 1
        console.log(pageNo)
        this.setData({
          pageNo
        })
      }
      wx.hideLoading()
    }).catch(error => {

    })
  },
  getCustomerDetail() {
    Fetch({
      customerId: this.data.customerId
    }, URL.customerDetail, app).then(({ data }) => {
      this.setData({
        customerDetail: data.item
      })
    }).catch(error => {

    })
  },
  handleCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile //仅为示例，并非真实的电话号码
    })
  },
  handleConfirm(e) {
    console.log(e.detail.value)
    if (!e.detail.value || this.data.submitting) {
      return
    }
    wx.showLoading({
      title: '正在提交...',
    })
    this.setData({
      submitting: true
    })
    Fetch({
      customerId: this.data.customerId,
      intro: e.detail.value
    }, URL.addFollow, app).then(({data}) => {
      wx.hideLoading()
      this.setData({
        submitting: false,
        pageNo: 1,
        remarkList: [],
        remark: ''
      }, () => {
        this.getAllRemark(this.resetRemark())
      })
    }).catch((error) => {
      wx.hideLoading()
      this.setData({
        submitting: false
      })
    })
  },
  resetRemark() {
    this.setData({
      pageNo: 1,
      remarkList: [],
      totalCount: ''
    })
  }
})