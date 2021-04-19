const app = getApp()
import { getUserDetail, fetchTicket } from '../../utils/util'
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Page({
  data: {
    loading: false,
    name: '',
    gender: '1',
    phone: '',
    remark: '',
    genders: [
      { value: '1', name: '男', checked: false },
      { value: '0', name: '女', checked: false },
    ],
    recommendHouse: null,
    sub1: 'PhFG6BjeKRkTISM7cXTsttJ2ZyU0LPZ0jW68hsgZneM', // 项目签约提醒	
    sub2: 'uHlt7hZjmj4YLEGT6hY3YodbRgvNOlhl_BrbQg2cyBk' // 佣金支付成功通知	
  },
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
      })
    }
    this.setData({
      recommendHouse: app.globalData.recommendHouse
    })
  },
  onHide: function() {
    app.globalData.recommendHouse = ''
  },
  onLoad: async function (options) {
    console.log(options)
    app.globalData.inviteCode = options.inviteCode || ''
    app.globalData.inviteMobile = options.inviteMobile || ''
    await getUserDetail(app)
    await fetchTicket(app)
    this.getTabBar().setData({
      agentUser: app.globalData.sysUserInfo.agentUser
    })
  },
  bindKeyInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyInputPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindKeyInputRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  handleSelect() {
    wx.navigateTo({
      url: '../select-house/select-house'
    })
  },
  radioChange: function (data) {
    let {dataset} = data.currentTarget
    console.log(dataset)
    this.setData({
      gender: dataset.value
    })
  },
  validateForm() {
    if (this.data.name && this.data.phone && this.data.gender && this.data.recommendHouse) {
      return true
    } else {
      let title = ''
      if (!this.data.name) {
        title = '请输入客户姓名'
      } else if (!this.data.gender) {
        title = '请选择用户性别'
      } else if (!this.data.phone) {
        title = '请输入客户电话号码'
      } else if (!this.data.recommendHouse) {
        title = '请推荐楼盘'
      }
      wx.showToast({
        title,
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
    this.loading = true
    wx.showLoading({
      title: '提交中...',
    })
    Fetch({
      realname: this.data.name,
      mobile: this.data.phone,
      gender: this.data.gender,
      houseId: this.data.recommendHouse.houseId,
      intro: this.data.remark,
      inviteCode: app.globalData.inviteCode
    }, URL.recommend, app).then(({ data }) => {
      this.loading = false
      wx.hideLoading()
      this.selectComponent("#toast").showToast('推荐成功');
      this.setData({
        name: '',
        gender: '1',
        phone: '',
        remark: '',
        recommendHouse: null
      })
      app.globalData.recommendHouse = null
      wx.getSetting({
        withSubscriptions: true,
        success: (res) => {
          console.log(res.subscriptionsSetting, this.data.sub1)
          const subscriptions = res.subscriptionsSetting
          // 未点击总是订阅，则呼起弹窗
          if (!(subscriptions && subscriptions[this.data.sub1] && subscriptions[this.data.sub2])) {
            wx.requestSubscribeMessage({
              tmplIds: [this.data.sub1, this.data.sub2],
              success (res) {
                console.log(res)
              },
              fail (error) {
                console.log(error)
              }
            })
          }
        }
      })
    }).catch(error => {
      console.log(error)
      this.loading = false
      wx.hideLoading()
      this.selectComponent("#toast").showToast('操作失败：' + error.result_msg);
      // wx.showToast({
      //   title: `操作失败：${error.result_msg}`,
      //   icon: 'none',
      //   duration: 2000
      // })
    })
  }
})
