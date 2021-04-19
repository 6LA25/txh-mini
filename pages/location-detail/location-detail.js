const QQMapWX = require('../../common/sdk/qqmap-wx-jssdk.min.js')
const app = getApp()
const qqmapsdk = new QQMapWX({
  key: 'UPFBZ-TLSWD-3CY4U-HTWPI-AZ53E-63BTT'
});
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
import {
  getTrafficData
} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseId: '',
    houseDetail: null, // 楼盘详情
    latitude: '',
    longitude: '',
    selected: '1',
    markers: [{
      id: 1,
      latitude: '',
      longitude: '',
      name: '',
      iconPath: '/image/building_default.png',
      width: '40rpx',
      height: '40rpx',
      callout: {
        content: '',
        boxShadow: 'none',
        display: 'ALWAYS',
        color: '#E32835',
        bgColor: '#fff',
        borderColor: '#E32835',
        borderWidth: 1,
        borderRadius: 4,
        padding: 6,
        textAlign: 'center',
        fontSize: 12,
      },
    },],
    traffic: null,
    edu: null,
    hospital: null,
    shop: null,
    mapCtx: null,
    currentSelectedId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      houseId: options.id
    }, () => {
      this.getHouseDetail()
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.houseDetail.name,
      path: `/pages/location-detail/location-detail?id=${this.data.houseDetail.houseId}`,
      imageUrl: this.data.houseDetail.coverImageLink
    }
  },
  handleSelectItem(e) {
    console.log(e.currentTarget.dataset.id)
    let selected = this.data.markers.find(item => { return item.id / 1 === e.currentTarget.dataset.id / 1 })
    let selectedIndex = this.data.markers.findIndex(item => { return item.id / 1 === e.currentTarget.dataset.id / 1 })
    console.log(selectedIndex)
    let _makers = JSON.parse(JSON.stringify(this.data.markers))
    _makers.forEach((item, index) => {
      if (index > 0) {
        if (item.id == e.currentTarget.dataset.id) {
          item.iconPath = '/image/address.png'
        } else {
          item.iconPath = '/image/address_default.jpg'
        }
      }
    })
    this.setData({
      latitude: selected.latitude,
      longitude: selected.longitude,
      currentSelectedId: e.currentTarget.dataset.id / 1,
      markers: _makers
    })
  },
  // 获取楼盘详情
  getHouseDetail() {
    wx.showLoading({
      title: '加载中',
    })
    Fetch({
      houseId: this.data.houseId,
      inviteCode: ''
    }, URL.houseDetail, app).then(({ data }) => {
      console.log(data)
      this.data.markers.forEach((maker, index) => {
        if (index === 0) {
          this.setData({
            ['markers[0].id']: data.item.houseId,
            ['markers[0].callout.content']: data.item.name,
            ['markers[0].latitude']: data.item.lat,
            ['markers[0].longitude']: data.item.lng
          })
        }
      })
      this.setData({
        houseDetail: data.item,
        latitude: data.item.lat,
        longitude: data.item.lng
      }, () => {
        this.mapCtx = wx.createMapContext('myMap')
        this.fetchMapDetail()
      })
    })
  },
  handleTapTagLocation(e) {
    // e.detail = {markerId}
    console.log(e.markerId)
  },
  handletoggleIcon() {
    this.setData({
      'markers[1].callout.color': '#409eff'
    })
  },
  handleNavigate() {
    console.log(this.data.latitude, this.data.longitude, this.data.houseDetail.name)
    let _me = this
    wx.openLocation({
      latitude: Number(_me.data.houseDetail.lat),
      longitude: Number(_me.data.houseDetail.lng),
      name: _me.data.houseDetail.name,
      scale: 18
    })
  },
  handleBackIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  handleSelectDetail(e) {
    console.log(e)
    this.setData({
      selected: e.currentTarget.dataset.index
    })
    wx.nextTick(() => {
      this.initMakers()
    })
  },
  async fetchMapDetail() {
    let traffic = await getTrafficData({
      keyword: '交通',
      latitude: this.data.latitude,
      longitude: this.data.longitude
    })
    let edu = await getTrafficData({
      keyword: '教育',
      latitude: this.data.latitude,
      longitude: this.data.longitude
    })
    let hospital = await getTrafficData({
      keyword: '医疗',
      latitude: this.data.latitude,
      longitude: this.data.longitude
    })
    let shop = await getTrafficData({
      keyword: '商业',
      latitude: this.data.latitude,
      longitude: this.data.longitude
    })
    this.setData({
      traffic,
      edu,
      hospital,
      shop
    })
    wx.nextTick(() => {
      this.initMakers()
      wx.hideLoading()
    })
  },
  initMakers() {
    let mks = [this.data.markers[0]]
    let _datas = [this.data.traffic, this.data.edu, this.data.hospital, this.data.shop]
    let needData = _datas[this.data.selected / 1 - 1] || {};
    (needData.data || []).forEach(item => {
      mks.push({
        title: item.title,
        id: item.id,
        latitude: item.location.lat,
        longitude: item.location.lng,
        iconPath: '/image/address_default.jpg',
        width: 14,
        height: 18,
      })
    })
    this.setData({
      markers: mks
    })
  }
})