// pages/house-type/index.js
const app = getApp()
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAuth: false,
    id: '',
    houseType: null,
    bannerList: [],
    bannerCounts: '',
    userInfo: null, // 微信授权用户信息
    sysUserInfo: null, // 系统登录后用户信息
    houseId: '',
    houseDetail: null,
    showShareDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      houseId: options.houseId,
      userInfo: app.globalData.userInfo,
      sysUserInfo: app.globalData.sysUserInfo,
      hasAuth: app.globalData.hasClickAuth
    })
    this.getHouseTypeDetail()
    this.getHouseDetail()
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
    let id = this.data.houseDetail.houseId
    let name = this.data.houseDetail.name
    let cover = this.data.houseDetail.coverImageLink
    
    Fetch({
      houseId: id
    }, URL.addShareCount, app).then(({ data }) => { })
    return {
      title: name,
      path: `/pages/house-detail/index?id=${id}&inviteCode=${app.globalData.sysUserInfo.userCode}&inviteMobile=${app.globalData.sysUserInfo.phoneNumber}`,
      imageUrl: cover
    }
  },
  getHouseDetail() {
    Fetch({
      houseId: this.data.houseId,
      inviteCode: ''
    }, URL.houseDetail, app).then(({ data }) => {
      console.log(data)
      this.setData({
        houseDetail: data.item
      })
    })
  },
  onMyEvent(e) {
    this.setData({
      hasAuth: true
    })
  },
  getHouseTypeDetail() {
    Fetch({
      aid: this.data.id
    }, URL.houseTypeItem, app).then(({ data }) => {
      let bannerList = []
      if (data.item.huxingtu.length > 0) {
        bannerList.push({
          imageLink: data.item.huxingtu[0].filepath
        })
      }
      if (data.item.yangbantu.length > 0) {
        bannerList.push({
          imageLink: data.item.yangbantu[0].filepath
        })
      }
      // data.item.allImageList.forEach((item => {
      //   bannerList.push({
      //     imageLink: item.filepath
      //   })
      // }))
      data.item.tags = data.item.tags.split(',')
      data.item.stw = `${data.item.shi}室${data.item.ting}厅`+ (data.item.chu ? `${data.item.chu}厨` : '') + (data.item.wei ? `${data.item.wei}卫` : '')
      this.setData({
        houseType: data.item,
        bannerList,
        bannerCounts: data.item.allImageList.length
      })
    })
  },
  onMyDialog() {
    if (!this.data.houseDetail.shareImageLink) {
      wx.showToast({
        title: '该楼盘未设置分享图片',
        icon: 'none',
        duration: 1000
      })
      return
    }
    this.setData({
      showShareDialog: true
    })
  },
  handleToggleShareDialog() {
    this.setData({
      showShareDialog: false
    })
  },
  handlePreviewImg() {
    wx.navigateTo({
      url: `/pages/Secondary/pages/housetype-photos/index?id=${this.data.id}`
    })
  },
})