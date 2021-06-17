import { Fetch } from '../../../utils/http'
import URL from '../../../utils/url'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    housesList: [],
    pageNo: 1,
    pageSize: 10,
    loadingHouses: false,
    totalHouses: '',
    from: '',
    prev: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      from: options.tag,
      prev: options.prev || ''
    })
    this.searchHouses()
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
    this.searchHouses()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleConfirm(e) {
    console.log(e)
    let value = e.detail.value
    if (value === this.data.search) {
      return
    }
    this.setData({
      search: value
    }, () => {
      this.searchHouses(this.resetSearch)
    })
  },
  searchHouses(reset) {
    if (this.data.loadingHouses) {
      return
    }
    if (reset) {
      reset()
    }
    if (this.data.housesList.length === this.data.totalHouses) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loadingHouses: true
    })
    Fetch({
      title: this.data.search, // 搜索关键词
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    }, URL.articles, app).then(({ data }) => {
      console.log(data)
      let housesList = this.data.housesList
      housesList.push(...data.items)
      this.setData({
        housesList,
        totalHouses: data.totalCount,
        loadingHouses: false
      })
      if (housesList.length < data.totalCount) {
        let pageNo = this.data.pageNo
        pageNo = pageNo + 1
        console.log(pageNo)
        this.setData({
          pageNo
        })
      }
      wx.hideLoading()
    })
  },
  resetSearch() {
    this.setData({
      pageNo: 1,
      housesList: [],
      totalHouses: ''
    })
  },
  handleJumpRecommend(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../news-detail/detail?id=${id}`
    })
  }
})