const app = getApp()
const QQMapWX = require('../../common/sdk/qqmap-wx-jssdk.min.js')
import { getTrafficData, getUserDetail, fetchTicket } from '../../utils/util'
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Page({
  data: {
    hasAuth: false,
    userInfo: null, // 微信授权用户信息
    houseId: '',
    sysUserInfo: null, // 系统登录后用户信息
    houseDetail: null, // 楼盘详情
    houseApartments: [], // 楼盘户型
    houseApartmentsStr: '',
    latitude: '', //纬度
    longitude: '', // 经度
    inviteMobile: '',
    informType: '', // 弹窗状态 变价/开盘
    markers: [
      {
        id: '',
        latitude: '', //纬度
        longitude: '', // 经度
        iconPath: '/image/address.png',
        width: 14,
        height: 18,
        callout: {
          content: '',
          display: 'ALWAYS',
          color: '#fff',
          bgColor: '#E32835',
          padding: 6,
          textAlign: 'center',
          fontSize: 12,
          borderRadius: 4
        },
      }
    ],
    traffic: null,
    edu: null,
    hospital: null,
    shop: null,
    nearbyHouse: [], // 附近楼盘
    imgUrl: '',
    qrCode: '',
    showShareDialog: false,
    showDesc: false,
    informDialogShow: false,
    houseDynamic: [],
    totalDynamic: 0
  },
  onShareAppMessage: function (e) {
    let id = ''
    let name = ''
    let cover = ''
    if (!e.target) {
      id = this.data.houseDetail.houseId
      name = this.data.houseDetail.name
      cover = this.data.houseDetail.coverImageLink
    } else {
      id = e.target.dataset.id
      name = e.target.dataset.name
      cover = e.target.dataset.cover
    }
    
    Fetch({
      houseId: id
    }, URL.addShareCount, app).then(({ data }) => { })
    return {
      title: name,
      path: `/pages/house-detail/index?id=${id}&inviteCode=${app.globalData.sysUserInfo.userCode}&inviteMobile=${app.globalData.sysUserInfo.phoneNumber}`,
      imageUrl: cover
    }
  },
  onLoad: async function (option) {
    console.log(option)
    // wx.hideShareMenu();
    app.globalData.inviteCode = option.inviteCode || ''
    app.globalData.inviteMobile = option.inviteMobile || ''
    this.setData({
      houseId: option.id,
      inviteCode: option.inviteCode || ''
    })
    let userInfo = await getUserDetail(app)
    let ticket = await fetchTicket(app)
    this.setData({
      userInfo: app.globalData.userInfo,
      sysUserInfo: app.globalData.sysUserInfo,
      hasAuth: app.globalData.hasClickAuth
    })
    wx.createMapContext('houseMap')
    this.getHouseDetail()
    this.addHouseAccess()
    this.getHouseApartments()
    this.getHouseDynamic()
  },
  onShow: function () {
  },
  getHouseDynamic() {
    Fetch({
      houseId: this.data.houseId,
      pageNo: 1,
      pageSize: 3,
      type: -1
    }, URL.trends, app).then(({ data }) => {
      this.setData({
        totalDynamic: data.totalCount,
        houseDynamic: data.items
      })
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
    console.log(traffic, edu, hospital, shop)
    this.setData({
      traffic,
      edu,
      hospital,
      shop
    })
  },
  handlePreviewImg(e) {
    wx.navigateTo({
      url: `../house-photos/house-photos?id=${this.data.houseId}`
    })
  },
  handleFollowHouse() {
    Fetch({
      houseId: this.data.houseId
    }, URL.houseFollow, app).then(({ data }) => {
      let houseDetail = this.data.houseDetail
      houseDetail.followStatus = !houseDetail.followStatus
      this.setData({
        houseDetail
      })
    })
  },
  // 更新浏览记录/及围观人数
  addHouseAccess() {
    Fetch({
      houseId: this.data.houseId
    }, URL.addHouseAccess, app).then(({ data }) => {

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

      let bannerList = []
      data.item.bannerList.forEach(banner => {
        bannerList.push({
          imageLink: banner
        })
      })
      data.item.bannerList = bannerList
      // 定义建筑面积范围
      let _acreage = data.item.acreage.split(/,|，/).sort(function(a, b){return a-b;})
      if (_acreage.length > 1) {
        data.item._acreage = `${_acreage[0]}-${_acreage[_acreage.length - 1]}`
      } else if (_acreage.length === 1) {
        data.item._acreage = _acreage[0]
      }
      
      // 修改周边格式
      if (data.item.rim) {
        data.item.rim = data.item.rim.split('\n')
      } else {
        data.item.rim = []
      }
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
        wx.hideLoading()
        this.fetchMapDetail()
        this.getNearbyHouses()
      })
    })
  },
  // 获取楼盘户型
  getHouseApartments() {
    Fetch({
      houseId: this.data.houseId
    }, URL.houseApartments, app).then(({ data }) => {
      let apartments = []
      data.items.forEach(item => {
        if (item.floorage) {
          apartments.push(`${item.floorage}m²户型`)
        }
      })
      this.setData({
        houseApartments: data.items,
        houseApartmentsStr: apartments.join('｜')
      })
    })
  },
  handleJumpLocationDetail() {
    wx.navigateTo({
      url: `../location-detail/location-detail?id=${this.data.houseId}`
    })
  },
  handleJumpMore() {
    wx.navigateTo({
      url: `../house-survey/house-survey?id=${this.data.houseId}`
    })
  },
  handleJumpCircusee() {
    wx.navigateTo({
      url: `../circusee-records/index?id=${this.data.houseId}`
    })
  },
  getNearbyHouses() {
    Fetch({
      lat: this.data.latitude,
      lng: this.data.longitude,
      houseId: this.data.houseId
    }, URL.nearbyHouse, app).then(({ data }) => {
      this.setData({
        nearbyHouse: data.items
      })
    })
  },
  onMyEvent(e) {
    this.setData({
      hasAuth: true
    })
  },
  onMyDialog() {
    if (!this.data.houseDetail.shareImageLink) {
      this.selectComponent("#toast").showToast('该楼盘未设置分享图片');
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
  handlePreviewType(e) {
    wx.navigateTo({
      url: `/pages/house-type/index?id=${e.currentTarget.dataset.id}&houseId=${this.data.houseDetail.houseId}`
    })
    // console.log(e)
    // let index = e.currentTarget.dataset.index
    // wx.previewImage({
    //   current: this.data.houseApartments[index].imageList[0], // 当前显示图片的http链接
    //   urls: this.data.houseApartments[index].imageList// 需要预览的图片http链接列表 
    // })
  },
  handleToggleDesc() {
    this.setData({
      showDesc: !this.data.showDesc
    })
  },
  handleShowInformDialog(e) {
    this.setData({
      informType: e.currentTarget.dataset.tag,
      informDialogShow: true
    })
  },
  myCloseInformDialog() {
    // this.selectComponent("#toast").showToast('操作成功');
    this.setData({
      informType: '',
      informDialogShow: false
    })
  },
  myComfirmMobile(e) {
    console.log(e.detail)
    this.selectComponent("#toast").showToast('操作成功');
    this.myCloseInformDialog()
  },
  handleJumpStates() {
    wx.navigateTo({
      url: `../house-states/house-states?id=${this.data.houseId}&name=${encodeURIComponent(this.data.houseDetail.name)}`
    })
  },
  handleJumpPreregistration() {
    wx.navigateTo({
      url: `../pre-registration/pre-registration?houseId=${this.data.houseId}&houseName=${this.data.houseDetail.name}`
    })
  },
  handleJumpHousetypes() {
    wx.navigateTo({
      url: `/pages/Secondary/pages/housetype-list/index?houseId=${this.data.houseId}`
    })
  }
})
