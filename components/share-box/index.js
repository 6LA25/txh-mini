// components/share-box/index.js
const app = getApp()
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
      wx.switchTab({
        url: '../../pages/recommend/index'
      })
    },
    handleCall(e) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.mobile //仅为示例，并非真实的电话号码
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
    // wx api绑定button获取用户信息
    getUserInfo: async function (e) {
      console.log('授权获取用户信息：', e)
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.encryptedData = e.detail.encryptedData
      app.globalData.ivStr = e.detail.iv
      let userInfo = await _asyncUserInfo(app)
      console.log(userInfo)
      // 更新本次授权后的信息
      this.setData({
        updateUserInfo: e.detail.userInfo
      })
      this.triggerEvent('myevent', e.detail.userInfo, {})
    },
    handleShowDialog() {
      this.triggerEvent('mydialog', {}, {})
    }
  }
})