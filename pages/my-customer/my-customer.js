import { Fetch } from '../../utils/http'
import { getTrafficData, getUserDetail, fetchTicket } from '../../utils/util'
import URL from '../../utils/url'
const app = getApp()
// pages/my-customer/my-customer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    pageNo: 1,
    pageSize: 5,
    customerList: [],
    totalCount: '',
    customerStatus: [
      { status: -1, text: '全部' },
      { status: 0, text: '关单' },
      { status: 1, text: '待跟进' },
      { status: 2, text: '联系中' },
      { status: 3, text: '已到访' },
      { status: 4, text: '已认筹' },
      { status: 5, text: '已认购' },
      { status: 6, text: '已签约' }
    ],
    timeStatus: [
      { status: '7', text: '近7天' },
      { status: '30', text: '近30天' }
    ],
    selected: -1,
    filterShow: false,
    search: '',
    startTime: '',
    endTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let userInfo = await getUserDetail(app)
    let ticket = await fetchTicket(app)
    this.fetchList()
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
    this.fetchList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  fetchList(reset) {
    if (this.data.loading) {
      return
    }
    if (reset) {
      reset()
    }
    if (this.data.customerList.length === this.data.totalCount) {
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
      keyword: this.data.search,
      followStatus: this.data.selected,
      startTime: this.data.startTime,
      endTime: this.data.endTime
    }, URL.myCustomer, app).then(({ data }) => {
      let customerList = this.data.customerList
      customerList.push(...data.items)
      this.setData({
        customerList,
        totalCount: data.totalCount,
        loading: false
      })
      if (customerList.length < data.totalCount) {
        let pageNo = this.data.pageNo
        pageNo = pageNo + 1
        console.log(pageNo)
        this.setData({
          pageNo
        })
      }
      wx.hideLoading()
    }).catch(error => { })
  },
  handleCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  handleToggleTime(e) {
    let days = e.currentTarget.dataset.status / 1
    this.setData({
      startTime: this.getYMD(new Date().getTime() - (days * 24 * 60 * 60 * 1000)),
      endTime: this.getYMD(new Date().getTime()),
      currentSelectedDay: e.currentTarget.dataset.status
    })
  },
  handleToggleStatus(e) {
    console.log(e)
    if (this.data.selected === e.currentTarget.dataset.status / 1) {
      return
    }
    this.setData({
      selected: e.currentTarget.dataset.status / 1
    })
  },
  getYMD(time) {
    let year = new Date(time).getFullYear()
    let month = new Date(time).getMonth() + 1
    var day = new Date(time).getDate()
    return `${year}-${month}-${day}`
  },
  handleToggleDialog() {
    this.setData({
      filterShow: !this.data.filterShow
    })
  },
  searchChange(e) {
    this.setData({
      search: e.detail.value
    })
  },
  handleJumpSchdule(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../customer-schedule/customer-schedule?id=${id}`
    })
  },
  resetSearch() {
    this.setData({
      pageNo: 1,
      customerList: [],
      totalCount: '',
      startTime: '',
      endTime: '',
      selected: -1,
      currentSelectedDay: ''
    })
    this.fetchList()
  },
  handleConfirm(e) {
    console.log(e.detail.value)
    if (e.detail.value === this.data.search) {
      return
    }
    this.setData({
      search: e.detail.value
    }, () => {
      this.fetchList(this.resetSearch)
    })
  },
  bindStartDateChange(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEndDateChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  handleConfirmFilter() {
    this.setData({
      pageNo: 1,
      customerList: [],
      totalCount: '',
    })
    this.fetchList()
    this.setData({
      filterShow: false
    })
  }
})