// pages/bind-alipay/bind-alipay.js
const app = getApp()
import { Fetch } from '../../../../utils/http'
import URL from '../../../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankAccount: '', // 银行账户
    bankPayee: '', // 真实姓名
    bankTitle: '', // 银行名称
    bankMobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bankAccount: app.globalData.sysUserInfo.bankAccount,
      bankPayee: app.globalData.sysUserInfo.bankPayee,
      bankTitle: app.globalData.sysUserInfo.bankTitle,
      bankMobile: app.globalData.sysUserInfo.bankMobile
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
  bindKeyBankPayee(e) {
    this.setData({
      bankPayee: e.detail.value
    })
  },
  bindKeyAlipayNo(e) {
    this.setData({
      bankTitle: e.detail.value
    })
  },
  bindKeyAlipayName(e) {
    this.setData({
      bankAccount: e.detail.value
    })
  },
  bindKeyBankMobile(e) {
    this.setData({
      bankMobile: e.detail.value
    })
  },
  handleSubmit() {
    if (!this.data.bankTitle || !this.data.bankAccount || !this.data.bankPayee || !this.data.bankMobile) {
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      loading: true
    })
    Fetch({
      bankPayee: this.data.bankPayee,
      bankTitle: this.data.bankTitle,
      bankAccount: this.data.bankAccount,
      bankMobile: this.data.bankMobile
    }, URL.bank, app).then(({ data }) => {
      // this.selectComponent("#toast").showToast('提交成功');
      app.globalData.sysUserInfo.bankPayee = this.data.bankPayee
      app.globalData.sysUserInfo.bankTitle = this.data.bankTitle
      app.globalData.sysUserInfo.bankAccount = this.data.bankAccount
      app.globalData.sysUserInfo.bankMobile = this.data.bankMobile
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/center/center'
        })
        this.setData({
          loading: false
        })
      }, 2000)
    }).catch(() => {
      this.selectComponent("#toast").showToast('提交失败');
      this.setData({
        loading: false
      })
    })
  }
})