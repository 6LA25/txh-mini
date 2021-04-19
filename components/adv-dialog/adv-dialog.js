// components/adv-dialog/adv-dialog.js
//获取应用实例
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached() {
      this.setData({
        hasShow: app.globalData.hasAdvShow
      })
      Fetch(null, URL.openAd, app).then(({ data }) => {
        if (data.items.length > 0) {
          this.setData({
            dialogShow: true,
            adv: data.items[0]
          })
          app.globalData.hasAdvShow = true
        }
      })
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    dialogShow: false,
    hasShow: false,
    adv: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCloseDialog() {
      this.setData({
        dialogShow: false
      })
    },
    handleJump() {
      // 内部链接
      let adv = this.data.adv
      if (adv.linkType === 1) {
        wx.navigateTo({
          url: `../house-detail/index?id=${adv.link}`
        })
      } else {
        wx.navigateTo({
          url: `../out/out?url=${adv.link}`
        })
      }
      this.setData({
        dialogShow: false
      })
    }
  }
})
