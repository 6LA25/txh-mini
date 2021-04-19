// pages/share-page/share-page.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sysUserInfo: null,
    imgUrl: '../../image/share_bg@2x.png',
    compositing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      sysUserInfo: app.globalData.sysUserInfo
    }, () => {
      this.compositePicture()
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
  getImgInfo(src) {
    console.log(src)
    return new Promise(resolve => {
      wx.getImageInfo({
        src,
        success: res => {
          resolve(res.path)
        },
        fail: err => {
          wx.showModal({
            title: '温馨提示',
            content: '获取图片信息失败，请重试' + JSON.stringify(err),
            showCancel: false
          })
        }
      })
    })
  },
  // 生成二维码合成图片
  async compositePicture() {
    wx.showLoading({
      title: '正在生成分享图片',
      mask: true
    })
    this.setData({
      compositing: true
    })
    let that = this
    const client_width = wx.getSystemInfoSync().windowWidth
    // const client_height =  wx.getSystemInfoSync().windowHeight
    const client_height =  605 // 背景图片高度
    const ctx = wx.createCanvasContext("myCanvas")
    console.log('ctx', ctx)
    // 背景图
    let bgImg = this.data.imgUrl
    ctx.drawImage(bgImg, 0, 0, client_width, client_height)
    // 二维码
    const qrCode_width = 170
    const qrCode_height = 170
    let qrCode = await this.getImgInfo(this.data.sysUserInfo.agentCodeLink)
    ctx.drawImage(qrCode, (client_width - qrCode_width) / 2, 220, qrCode_width, qrCode_height)
    
    // 分享用户头像
    ctx.save();
    ctx.beginPath();
    ctx.arc(60, 570-2, 30, 0, Math.PI * 2, false)
    ctx.setFillStyle("#fff")
    ctx.fill()
    ctx.closePath();
    ctx.clip();
    let avatar = await this.getImgInfo(app.globalData.sysUserInfo.avatar)
    ctx.drawImage(avatar, 30, 535+3, 60, 60)
    ctx.restore();

    // 用户昵称
    ctx.setFontSize(16)
    ctx.setFillStyle("#333")
    ctx.fillText(app.globalData.sysUserInfo.displayName, 100, 570 - 2 - 2);

    // 手机号
    ctx.setFontSize(13)
    ctx.setFillStyle("#333")
    ctx.fillText(app.globalData.sysUserInfo.phoneNumber, 100, 570 - 2 - 2 + 20);

    ctx.restore();
    ctx.draw(true, () => {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          console.log("合成的带有小程序码的图片success》》》", res)
          let tempFilePath = res.tempFilePath
          that.setData({
            tempFilePath,
            compositing: false
          })
          console.log("合成的带有小程序码的图片的信息》》》", res)
          wx.hideLoading()
        },
        fail: function (res) {
          wx.hideLoading()
          that.setData({
            compositing: false
          })
          wx.showModal({
            title: '温馨提示',
            content: '生成分享图片失败，请重试',
            showCancel: false
          })
        }
      })
    })

  },
  handleSaveImg() {
    if (this.data.compositing) {
      return
    }
    let that = this
    //判断用户是否授权"保存到相册"
    wx.getSetting({
      success(res) {
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { //用户允许授权，保存图片到相册
              // that.savePhoto();
              that.savePhoto()
            },
            fail() { //用户点击拒绝授权，跳转到设置页，引导用户授权
              console.log('reject')
              wx.openSetting({
                success() {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      that.savePhoto()
                    },
                    fail(error) {
                      console.log(error)
                    }
                  })
                },
                fail(error) {
                  console.log(error)
                  wx.showModal({
                    title: '提示',
                    content: '请开启相册权限',
                    success(res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success() {
                            wx.authorize({
                              scope: 'scope.writePhotosAlbum',
                              success() {
                                that.savePhoto();
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                }
              })
            }
          })
        } else { //用户已授权，保存到相册
          that.savePhoto()
        }
      }
    })
  },
  savePhoto() {
    wx.showLoading({
      title: '正在保存...',
    })
    wx.getImageInfo({
      src: this.data.tempFilePath,
      success: function (res) {
        console.log(res.path)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(result) {
            console.log(result)
            wx.hideLoading()
            wx.showToast({
              icon: 'success',
              title: '保存成功',
              duration: 1000
            })
          },
          fail(error) {
            console.log(error)
          }
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
})