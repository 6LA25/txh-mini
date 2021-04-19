// pages/house-survey/house-survey.js
const app = getApp()
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseDetail: null,
    houseId: '',
    houseApartments: '',
    userInfo: null, // 微信授权用户信息
    sysUserInfo: null, // 系统登录后用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      houseId: options.id,
      userInfo: app.globalData.userInfo,
      sysUserInfo: app.globalData.sysUserInfo,
    }, () => {
      this.getHouseApartments()
      this.getHouseDetail()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '楼盘概况'
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getHouseApartments() {
    Fetch({
      houseId: this.data.houseId
    }, URL.houseApartments, app).then(({data}) => {
      let apartments = []
      data.items.forEach(item => {
        if (item.floorage) {
          apartments.push(`${item.floorage}m²`)
        }
      })
      this.setData({
        houseApartments: apartments.join('｜')
      })
    })
  },
  // 获取楼盘详情
  getHouseDetail() {
    wx.showLoading({
      title: '加载中...'
    })
    Fetch({
      houseId: this.data.houseId,
      inviteCode: ''
    }, URL.houseDetail, app).then(({data}) => {
      console.log(data)
      wx.hideLoading()
      // 定义建筑面积范围
      let _acreage = data.item.acreage.split(/,|，/).sort(function(a, b){return a-b;})
      if (_acreage.length > 1) {
        data.item._acreage = `${_acreage[0]}-${_acreage[_acreage.length - 1]}`
      } else if (_acreage.length === 1) {
        data.item._acreage = _acreage[0]
      }
      
      let bannerList = []
      data.item.bannerList.forEach(banner => {
        bannerList.push({
          imageLink: banner
        })
      })
      data.item.bannerList = bannerList
      // 修改周边格式
      if (data.item.rim) {
        data.item.rim = data.item.rim.split('，')
      } else {
        data.item.rim = []
      }
      this.setData({
        houseDetail: data.item
      })
    })
  },
  handleJumpLocationDetail() {
    wx.navigateTo({
      url: `../location-detail/location-detail?id=${this.data.houseId}`
    })
  },
})