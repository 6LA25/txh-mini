const app = getApp()
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
// pages/house-photos.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseId: '',
    realImgs: [ // 实景图
    ],
    effectImgs: [ // 效果图
    ],
    houseTypeImgs: [ // 户型图
    ],
    circumImgs: [ // 周边图
    ],
    cover_img: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      houseId: options.id
    }, () => {
      wx.setNavigationBarTitle({
        title: '相册'
      })
      this.fetchPictures()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  fetchPictures() {
    Fetch({
      houseId: this.data.houseId
    }, URL.housePictures, app).then(({data}) => {
      console.log(data)
      this.setData({
        realImgs: data.realImages,
        effectImgs: data.renderImages,
        houseTypeImgs: data.apartmentImages,
        circumImgs: data.ambitusImages,
        cover_img: [data.cover_img]
      })
    })
  },
  handlePreviewImages(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data[e.currentTarget.dataset.preview]// 需要预览的图片http链接列表 
    })
  },
  errorImg(e) {
    console.log(e)
    let type = e.currentTarget.dataset.preview
    let errorIndex = e.currentTarget.dataset.errorimg
    let imgs = this.data[type]
    // 设置图片加载错误默认图
    imgs[errorIndex] = '../../image/address.png'
    this.setData({
      [type]: imgs
    })
    console.log(imgs)
  }
})