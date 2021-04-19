// pages/houses-focus/houses-focus.js
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHouses: false,
    hasAuth: false,
    userInfo: null,
    pageData: {
      pageNo: 1,
      pageSize: 10
    },
    housesList: [],
    totalHouses: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '关注房源'
    })
    this.setData({
      userInfo: app.globalData.userInfo,
      hasAuth: app.globalData.hasAuth
    })
    this.fetchHouses()
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
    if (app.globalData.hasClickAuth && !this.data.hasAuth) {
      this.setData({
        hasAuth: true
      })
    }
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
    this.fetchHouses()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    let cover = e.target.dataset.cover
    Fetch({
      houseId: id
    }, URL.addShareCount, app).then(({ data }) => { })
    return {
      title: name,
      path: `/pages/house-detail/index?id=${id}&inviteCode=${app.globalData.sysUserInfo.userCode}&inviteMobile=${app.globalData.sysUserInfo.phoneNumber}`,
      imageUrl: cover
    }
  },
  fetchHouses() {
    if (this.data.loadingHouses || this.data.housesList.length === this.data.totalHouses) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loadingHouses: true
    })
    Fetch(this.data.pageData, URL.followHouses, app).then(({ data }) => {
      let housesList = this.data.housesList
      housesList.push(...data.items)
      this.setData({
        housesList,
        totalHouses: data.totalCount,
        loadingHouses: false
      })
      if (housesList.length < data.totalCount) {
        let pageNo = this.data.pageData.pageNo
        pageNo = pageNo + 1
        console.log(pageNo)
        this.setData({
          ['pageData.pageNo']: pageNo
        })
      }
      wx.hideLoading()
    }).catch(error => {
      console.log(error)
    })
  },
  onMyEvent(e) {
    this.setData({
      hasAuth: true
    })
  },
})