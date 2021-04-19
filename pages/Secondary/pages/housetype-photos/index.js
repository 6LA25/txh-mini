// pages/Secondary/pages/housetype-photos/index.js
const app = getApp()
import { Fetch } from '../../../../utils/http'
import URL from '../../../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    huxingtu: [],
    yangbantu: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    }, () => {
      this.getHouseTypeDetail()
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
  handlePreviewImages(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data[e.currentTarget.dataset.preview]// 需要预览的图片http链接列表 
    })
  },
  getHouseTypeDetail() {
    Fetch({
      aid: this.data.id
    }, URL.houseTypeItem, app).then(({ data }) => {
      let huxingtu = data.item.huxingtu.map(item => {return item.filepath})
      let yangbantu = data.item.yangbantu.map(item => {return item.filepath})
      this.setData({
        huxingtu: huxingtu,
        yangbantu: yangbantu
      })
    })
  },
})