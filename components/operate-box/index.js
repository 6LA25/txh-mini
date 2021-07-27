// components/operate-box/index.js
const app = getApp()
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
import { _asyncUserInfo } from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sysinfo: {
      type: Object,
      value: null
    },
    house: {
      type: Object,
      value: {}
    },
    userInfo: {
      type: Object,
      value: null
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    inviteCode: '',
    mobile: '0510-82766688', // 安选联系电话
    inviteMobile: '',
    updateUserInfo: null // 本次授权获取用户信息
  },

  lifetimes: {
    attached() {
      // if (this.data.house.houseId) {
      //   app.globalData.recommendHouse = this.data.house
      // }
      this.setData({
        inviteCode: app.globalData.inviteCode,
        inviteMobile: app.globalData.inviteMobile
      })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleRecommend() {
      app.globalData.recommendHouse = this.data.house
      wx.switchTab({
        url: '../../pages/recommend/index'
      })
    },
    handleCall() {
      wx.makePhoneCall({
        phoneNumber: this.data.house.hotline,
        success: () => {
          this.makeCustomerRecord()
        }
      })
    },
    handleApply() {
      wx.navigateTo({
        url: '../../pages/apply-broker/apply-broker'
      })
    },
    handleConnect() {
      wx.makePhoneCall({
        phoneNumber: this.data.inviteMobile // 上级邀请经纪人的电话
      })
    },
    handleCallBoss() {
      wx.makePhoneCall({
        phoneNumber: this.data.mobile // 系统电话
      })
    },
    handleShowDialog() {
      this.triggerEvent('mydialog', {}, {})
    },
    handleYuYue() {
      wx.navigateTo({
        url: `../pre-registration/pre-registration`
      })
    },
    handleChat(e) {
      this.triggerEvent('mychat', {
        a: 1
      }, e)
    },
    makeCustomerRecord() {
      Fetch({
        agentMobile: this.data.inviteMobile || '',
        mobile: this.data.sysinfo ? this.data.sysinfo.phoneNumber : '',
        houseId: this.data.house.houseId
      }, URL.collectCustomer, app).then(({data}) => {

      }).catch((error) => {
      })
    }
  }
})
