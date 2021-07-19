// components/house-item.js
const app = getApp()
import { _asyncUserInfo } from '../../utils/util'
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      value: null
    },
    hasAuth: {
      type: Boolean,
      value: false
    },
    house: {
      type: Object,
      value: {}
    }
  },
  lifetimes: {
    attached() {
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleJumpHouseDetail() {
      wx.navigateTo({
        url: `/pages/house-detail/index?id=${this.properties.house.houseId}`
      })
    },
    handleJumpCircusee() {
      wx.navigateTo({
        url: `/pages/circusee-records/index?id=${this.properties.house.houseId}`
      })
    },
    handleCollectHouse(e) {
      let houseId = e.currentTarget.dataset.id
      let {followStatus} = this.data.house
      Fetch({
        houseId
      }, URL.houseFollow, app).then(({ data }) => {
        let house = this.data.house
        house.followStatus = !house.followStatus
        this.setData({
          house
        })
      })
    },
    // wx api绑定button获取用户信息
    getUserInfo: async function (e) {
      console.log('授权获取用户信息：', e)
      // app.globalData.ticket = ''
      let userInfo = null
    // 点击确认后重新授权同步信息
      if (e.detail.rawData) {
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.encryptedData = e.detail.encryptedData
        app.globalData.ivStr = e.detail.iv
        await _asyncUserInfo(app)
      }

      console.log(userInfo)
      app.globalData.hasClickAuth = true
      this.triggerEvent('myevent', {}, {})
    },
  }
})
