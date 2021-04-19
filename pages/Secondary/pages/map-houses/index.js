const app = getApp()
const QQMapWX = require('../../../../common/sdk/qqmap-wx-jssdk.min.js')
const qqmapsdk = new QQMapWX({
  key: 'UPFBZ-TLSWD-3CY4U-HTWPI-AZ53E-63BTT'
});
import { getUserDetail, fetchTicket } from '../../../../utils/util'
import { Fetch } from '../../../../utils/http'
import URL from '../../../../utils/url'
// pages/map-houses/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseId: '',
    userInfo: null,
    houseDetail: null,
    selectedMaker: null,
    latitude: 31.60935,
    longitude: 120.262009,
    scale: 12, // 默认scale
    markers: [],
    touchStart: null,
    touchEnd: null,
    hasAuth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.hideShareMenu();
    let userInfo = await getUserDetail(app)
    let ticket = await fetchTicket(app)
    this.setData({
      userInfo: app.globalData.userInfo,
      hasAuth: app.globalData.hasClickAuth
    })
    this.getAllMapHouses()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '地图看房'
    })
    wx.createMapContext('myMap')
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
  onShareAppMessage: function (e) {
    let id = e.target.dataset.id || this.data.houseDetail.houseId
    let name = e.target.dataset.name || this.data.houseDetail.name
    let cover = e.target.dataset.cover || this.data.houseDetail.coverImageLink
    console.log(id, name, cover)
    Fetch({
      houseId: id
    }, URL.addShareCount, app).then(({ data }) => { })
    return {
      title: name,
      path: `/pages/house-detail/index?id=${id}&inviteCode=${app.globalData.sysUserInfo.userCode}&inviteMobile=${app.globalData.sysUserInfo.phoneNumber}`,
      imageUrl: cover
    }
  },
  // 获取地图内楼盘
  getAllMapHouses() {
    Fetch({}, URL.areaItems, app).then(({ data }) => {
      let houses = data.items
      // let makers = this.data.makers
      let markers = []
      houses.forEach(house => {
        markers.push({
          id: house.houseId,
          latitude: house.lat,
          longitude: house.lng,
          iconPath: '/image/building_default.png',
          width: '20rpx',
          height: '20rpx',
          callout: {
            content: house.houseName,
            boxShadow: 'none',
            display: 'ALWAYS',
            color: '#e25e60',
            bgColor: '#fff',
            borderColor: '#e25e60',
            padding: 6,
            textAlign: 'center',
            borderWidth: 1,
            fontSize: 12,
            borderRadius: 4,
            fontSize: 14
          },
        })
      })
      this.setData({
        markers,
        latitude: houses.length === 0 ? 31.60935 : houses[0].lat,
        longitude: houses.length === 0 ? 120.262009 : houses[0].lng
      })
    }).catch(error => {

    })
  },
  handleTapTagLocation(e) {
    // e.detail = {markerId}
    console.log(e)
    let markerId = e.markerId
    if (this.data.selectedMaker && this.data.selectedMaker.id === markerId) {
      return
    }
    this.setData({
      houseId: markerId
    }, () => {
      this.getHouseDetail()
    })
    this.data.markers.forEach((maker, index) => {
      let change = `markers[${index}].callout`
      let _change = {}
      if (maker.id === markerId) {
        _change = {
          [change + '.color']: '#333',
          [change + '.bgColor']: '#fff',
          [change + '.borderColor']: '#eee',
          selectedMaker: maker,
          latitude: maker.latitude,
          longitude: maker.longitude,
          scale: 16
        }
      } else {
        _change = {
          [change + '.color']: '#e25e60',
          [change + '.bgColor']: '#fff',
          [change + '.borderColor']: '#e25e60'
        }
      }
      this.setData(_change)
    })
  },
  handleTouchStart(e) {
    console.log(e)
    this.setData({
      touchStart: e.changedTouches[0]
    })
  },
  handleTouchEnd(e) {
    console.log(e)
    this.setData({
      touchEnd: e.changedTouches[0]
    })
    wx.nextTick(() => {
      if (this.data.touchEnd.pageY - this.data.touchStart.pageY > 50) {
        this.setData({
          selectedMaker: null,
          houseDetail: null,
          houseId: '',
          scale: 12
        })
        this.data.markers.forEach((maker, index) => {
          let change = `markers[${index}].callout`
          this.setData({
            [change + '.color']: '#e25e60',
            [change + '.bgColor']: '#fff',
            [change + '.borderColor']: '#e25e60'
          })
        })
      }
    })
  },
  handleJumpNearby() {
    wx.navigateTo({
      url: `../../../../pages/location-detail/location-detail?id=${this.data.houseId}`
    })
  },
  handleNavigate() {
    console.log(this.data.latitude)
    wx.openLocation({
      latitude: Number(this.data.latitude),
      longitude: Number(this.data.longitude),
      name: this.data.selectedMaker.callout.content,
      scale: 18
    })
  },
  // 获取楼盘详情
  getHouseDetail() {
    Fetch({
      houseId: this.data.houseId,
      inviteCode: ''
    }, URL.houseDetail, app).then(({ data }) => {
      this.setData({
        houseDetail: data.item
      })
    })
  },
  // 分享前授权，后重新获取ticket
  onMyEvent(e) {
    // app.globalData.ticket = ''
    this.setData({
      hasAuth: true
    })
  },
})