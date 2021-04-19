// components/share-poster/index.js
const app = getApp()
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dialogShow: {
      type: Boolean,
      value: false
    },
    houseDetail: {
      type: Object
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
    },
    hide: function () { },
    resize: function () { },
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.fetchHouseCode()
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    compositing: false,
    qrCode: '',
    tempNickname: '', // 修饰昵称
    tempFilePath: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fetchHouseCode() {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      Fetch({
        houseId: this.data.houseDetail.houseId
      }, URL.houseCode, app).then(({ data }) => {
        console.log(data)
        wx.hideLoading()
        this.setData({
          qrCode: data.item
        }, () => {
          this.getTempNickname()
          this.compositePicture()
        })
      })
    },
    handleClose() {
      this.triggerEvent('myCloseShare', null, {})
    },
    getTempNickname() {
      let name = app.globalData.sysUserInfo.displayName
      let tempNickname = name.length > 9 ? `${name.substring(0, 6)}...` : name
      this.setData({
        tempNickname
      })
    },
    roundRect(ctx, x, y, w, h, r) {
      // 开始绘制
      ctx.beginPath()
      // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
      // 这里是使用 fill 还是 stroke都可以，二选一即可
      ctx.setFillStyle('white')
      // ctx.setStrokeStyle('transparent')
      // 左上角
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

      // border-top
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.lineTo(x + w, y + r)
      // 右上角
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

      // border-right
      ctx.lineTo(x + w, y + h - r)
      ctx.lineTo(x + w - r, y + h)
      // 右下角
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

      // border-bottom
      ctx.lineTo(x + r, y + h)
      ctx.lineTo(x, y + h - r)
      // 左下角
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

      // border-left
      ctx.lineTo(x, y + r)
      ctx.lineTo(x + r, y)

      // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
      ctx.fill()
      // ctx.stroke()
      ctx.closePath()
      // 剪切
      ctx.clip()
    },
    // 生成二维码合成图片
    async compositePicture() {
      console.log('this.data.houseDetail', this.data.houseDetail)
      wx.showLoading({
        title: '正在生成分享图片',
        mask: true
      })
      this.setData({
        compositing: true
      })
      let that = this
      const ctx = wx.createCanvasContext("myCanvas", this)
      // 背景图
      let bgImg = await this.getImgInfo(this.data.houseDetail.shareImageLink)
      ctx.drawImage(bgImg, 0, 0, 260, 350)
      // 二维码
      const qrCode_width = 80
      const qrCode_height = 80
      ctx.save();
      // ctx.beginPath();
      // let arc_x = 170 + qrCode_width / 2
      // let arc_y = 230 + qrCode_height / 2
      // ctx.arc(arc_x, arc_y, (qrCode_width - 10) / 2, 0, Math.PI * 2, false)
      // ctx.clip();
      this.roundRect(ctx,175+10+10,235+25+10+10,qrCode_width - 20 -10,qrCode_width - 20 -10,4)
      let qrCode = await this.getImgInfo(this.data.qrCode)
      ctx.drawImage(qrCode, 175+10+10, 235+25+10+10, qrCode_width - 20 -10, qrCode_height - 20 -10)
      ctx.restore();

      // 分享用户头像
      ctx.save();
      ctx.beginPath();
      ctx.arc(30, 280+20+10+5, 20, 0, Math.PI * 2, false)
      ctx.fill()
      ctx.closePath();
      ctx.clip();
      let avatar = await this.getImgInfo(app.globalData.sysUserInfo.avatar)
      ctx.drawImage(avatar, 10, 260+20+10+5, 40, 40)
      ctx.restore();

      // 用户昵称
      ctx.setFontSize(14)
      ctx.setFillStyle("#fff")
      ctx.fillText(this.data.tempNickname, 55, 290+20+10+5);
      // 扫码备注
      ctx.setFontSize(10)
      ctx.setFillStyle("#fff")
      ctx.fillText('长按识别更多', 178+10, 330+12);

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
            console.log(res)
            wx.hideLoading()
            wx.showModal({
              title: '温馨提示',
              content: '生成分享图片失败，请重试',
              showCancel: false
            })
            that.setData({
              compositing: false
            })
          }
        }, this)
      })

    },
    getImgInfo(src) {
      console.log(src)
      return new Promise(resolve => {
        wx.getImageInfo({
          src,
          success: res => {
            console.log(res)
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
  }
})
