// pages/Secondary/pages/withdraw-deposit/index.js
const app = getApp()
import { Fetch } from '../../../../utils/http'
import { getTrafficData, getUserDetail, fetchTicket } from '../../../../utils/util'
import URL from '../../../../utils/url'
const computedBehavior = require('miniprogram-computed')

Page({

  /**
   * 页面的初始数据
   */
  behaviors: [computedBehavior],
  data: {
    pageNo: 1,
    pageSize: 10,
    loading: false,
    withdrawList: [],
    selectedIds: [],
    selectedAmount: 0,
    submitting: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let userInfo = await getUserDetail(app)
    let ticket = await fetchTicket(app)
    this.fetchCommissions()
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
    this.fetchCommissions()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  fetchCommissions() {
    if (this.data.loading) {
      return
    }
    if (this.data.withdrawList.length === this.data.totalCount && this.data.totalCount > 0) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loading: true
    })
    Fetch({
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      status: 0
    }, URL.commissionItems, app).then(({ data }) => {
      let withdrawList = this.data.withdrawList
      // 默认未选中
      data.items.forEach(item => {
        item.checked = false
      })
      withdrawList.push(...data.items)
      this.setData({
        withdrawList,
        totalCount: data.totalCount,
        loading: false
      })
      if (withdrawList.length < data.totalCount) {
        let pageNo = this.data.pageNo
        pageNo = pageNo + 1
        console.log(pageNo)
        this.setData({
          pageNo
        })
      }
      wx.hideLoading()
    }).catch(error => {
      console.log(error)
    })
  },
  computeSelectedAmount(ids) {
    const items = this.data.withdrawList
    const values = ids
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].commissionId == values[j]) {
          items[i].checked = true
          break
        }
      }
    }

    this.setData({
      withdrawList: items,
      selectedIds: ids
    }, () => {
      let selectedList = this.data.withdrawList.filter(item => { return item.checked === true })
      this.setData({
        selectedAmount: selectedList.reduce((total, item) => total + item.commission, 0).toFixed(2)
      })
    })
  },
  checkboxChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.computeSelectedAmount(e.detail.value)
  },
  handleToggleAllSelected(e) {
    let ids = []
    // 全选
    if (e.detail.value.length) {
      ids = this.data.withdrawList.map(item => item.commissionId)
    }
    this.computeSelectedAmount(ids)
  },
  handleWithdraw() {
    if (this.data.submitting || this.data.selectedIds.length === 0) {
      return
    }
    // 完善银行卡信息
    if (!app.globalData.sysUserInfo.bankAccount) {
      wx.showToast({
        title: '请完善您的银行卡信息',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      submitting: true
    })
    wx.showLoading({
      title: '提现中...',
    })
    Fetch({
      ids: this.data.selectedIds.join(',')
    }, URL.withdraw, app).then(({ data }) => {
      wx.hideLoading()
      wx.showToast({
        title: '操作成功',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        pageNo: 1,
        loading: false,
        withdrawList: [],
        selectedIds: [],
        selectedAmount: 0,
        submitting: false
      }, () => {
        this.fetchCommissions()
      })
    }).catch(error => {
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '操作失败：' + error.result_msg,
        duration: 2000
      })
      this.setData({
        submitting: false
      })
    })
  }
})