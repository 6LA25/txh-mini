// pages/Secondary/pages/housetype-list/index.js
const app = getApp()
import { Fetch } from '../../../../utils/http'
import URL from '../../../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseId: '',
    filterList: [],
    houseTypes: [],
    currentType: -1,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      houseId: options.houseId
    }, () => {
      this.getApartmentsInfo()
      this.getHouseApartments(-1)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取筛选列表
  getApartmentsInfo() {
    Fetch({
      houseId: this.data.houseId
    }, URL.apartmentsInfo, app).then(({ data }) => {
      let cnIndex = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
      let allTypes = 0
      if (data.items.length) {
        data.items.forEach(item => {
          item._type = `${cnIndex[item.type]}室`
        })
        allTypes = data.items.reduce((pre, item) => {
          return pre + (item.count / 1)
        }, 0)
        console.log(allTypes)
        this.setData({
          filterList: [
            {
              count: allTypes,
              _type: '全部',
              type: -1
            },
            ...data.items
          ]
        })
      }
    })
  },
  // 获取楼盘户型
  getHouseApartments(type) {
    if (this.data.loading) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      houseTypes: [],
      loading: true
    })
    Fetch({
      houseId: this.data.houseId,
      type
    }, URL.houseApartments, app).then(({ data }) => {
      data.items.forEach(item => {
        item.stw = `${item.shi}室${item.ting}厅` + (item.chu ? `${item.chu}厨` : '') + (item.wei ? `${item.wei}卫` : '')
      })
      this.setData({
        houseTypes: data.items,
        loading: false
      })
      wx.hideLoading()
    }).catch(error => {
      wx.hideLoading()
    })
  },
  // 筛选
  handleFilter(e) { 
    if (this.data.loading) {
      return
    }
    let currentType = e.currentTarget.dataset.type
    this.setData({
      currentType
    })
    this.getHouseApartments(currentType)
  },
  handlePreviewType(e) {
    wx.navigateTo({
      url: `/pages/house-type/index?id=${e.currentTarget.dataset.id}&houseId=${this.data.houseId}`
    })
  },
})