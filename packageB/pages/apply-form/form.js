import { Fetch } from '../../../utils/http'
import { getUserDetail, fetchTicket } from '../../../utils/util'
import URL from '../../../utils/url'
const computedBehavior = require('miniprogram-computed')

const app = getApp()
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    form: {},
    houseId: '',
    houseName: '',
    registerid: ''
  },
  computed: {
    validateResult(data) {
      let { detail, form } = data
      let result = []
      if (detail) {
        let list = detail.contentMap.list
        console.log('Object.keys(form)', Object.keys(form))
        Object.keys(form).forEach(k => {
          let content = list.find(item => {
            return item.id === k
          })
          if (content.required === '1' && !form[k]) {
            result.push(k)
          }
        })
        return result
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    await getUserDetail(app)
    await fetchTicket(app)
    this.getActivityDetail(options.id)

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

  getActivityDetail(registerid) {
    Fetch({
      registerid
    }, URL.applyActivityItem, app).then(({ data }) => {
      let contentMaps = data.contentMap.list
      let form = {}
      contentMaps.forEach(item => {
        form[item.id] = ''
      })
      console.log(form)
      this.setData({
        detail: data,
        form
      })
    })
  },
  setHouseSelect() {
    console.log(111111)
    let buyHouse = this.data.detail.contentMap.list.find(item => {
      return item.fieldname === '选购房源'
    })
    console.log('buyHouse', buyHouse)
    let form = JSON.parse(JSON.stringify(this.data.form))
    form[buyHouse.id] = this.data.houseId
    this.setData({
      form
    })
  },
  bindKeyInput(e) {
    console.log('e', e)
    let { currentTarget, detail } = e
    let form = JSON.parse(JSON.stringify(this.data.form))
    form[currentTarget.dataset.id] = detail.value
    this.setData({
      form
    })
  },
  handleSubmit() {
    if (this.data.validateResult.length > 0) {
      let hintId = this.data.validateResult[0]
      let { fieldname } = this.data.detail.contentMap.list.find(item => {
        return item.id === hintId
      })
      wx.showToast({
        title: `请填写${fieldname}`,
        icon: 'none',
        duration: 2000
      })
    } else {
      Fetch({
        registerid: this.data.detail.id,
        registerMap: {
          ...this.data.form
        }
      }, URL.applyActivity, app).then(({ data }) => {
        wx.showToast({
          title: '报名成功',
          icon: 'success',
          duration: 2000
        })
        let form = JSON.parse(JSON.stringify(this.data.form))
        Object.keys(form).forEach(k => {
          form[k] = ''
        })
        this.setData({
          form,
          houseId: '',
          houseName: '',
        })
      }).catch((error) => {
        wx.showToast({
          title: `操作失败：${error.result_msg}`,
          icon: 'none',
          duration: 2000
        })
      })
    }
  },
  handleSelect() {
    wx.navigateTo({
      url: '../../../pages/select-house/select-house?tag=pre&prev=apply'
    })
  },
})