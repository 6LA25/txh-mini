// pages/pre-registration/pre-registration.js
const app = getApp()
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    realname: '',
    mobile: '',
    reserveDate: '',
    reserveSection: '',
    houseId: '',
    houseName: '',
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.houseId) {
      this.setData({
        houseId: options.houseId,
        houseName: options.houseName
      })
    }
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
  bindKeyInputRealname(e) {
    this.setData({
      realname: e.detail.value
    })
  },
  bindKeyInputPhone(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      reserveDate: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      reserveSection: e.detail.value
    })
  },
  handleSelect() {
    wx.navigateTo({
      url: '../select-house/select-house?tag=pre'
    })
  },
  validateForm() {
    if (this.data.houseId && this.data.realname && this.data.mobile.length === 11 && this.data.reserveDate && this.data.reserveSection) {
      return true
    } else {
      if (this.data.mobile.length < 11) {
        wx.showToast({
          title: '请输入正确的11位手机号',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      wx.showToast({
        title: '请填写所有信息',
        icon: 'none',
        duration: 2000
      })
      return false
    }
  },
  handleSubmit() {
    if (!this.validateForm()) {
      return
    }
    this.setData({
      loading: true
    })
    wx.showLoading({
      title: '提交中...',
    })
    Fetch({
      realname: this.data.realname,
      mobile: this.data.mobile,
      houseId: this.data.houseId,
      reserveDate: this.data.reserveDate,
      reserveSection: this.data.reserveSection,
      type: '4',
      inviteCode: app.globalData.inviteCode
    }, URL.recommend, app).then(({ data }) => {
      wx.hideLoading()
      wx.showToast({
        title: '成功预约',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        realname: '',
        mobile: '',
        reserveDate: '',
        reserveSection: '',
        houseId: '',
        houseName: '',
        loading: false
      })
    }).catch(error => {
      console.log(error)
      this.setData({
        loading: false
      })
      wx.hideLoading()
      wx.showToast({
        title: error.result_msg,
        icon: 'none',
        duration: 2000
      })
    })
  }
})