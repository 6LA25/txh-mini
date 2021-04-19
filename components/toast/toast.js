// components/toast/toast.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {},
    content: '',
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showToast(val) {
      if (this.data.show) {
        return
      }
      var animation = null
      this.setData({
        show: true
      }, () => {
        animation = wx.createAnimation({
          duration: 300,
          timingFunction: 'ease',
        })
        this.animation = animation
        animation.opacity(1).step()
        this.setData({
          animationData: animation.export(),
          content: val
        })
      })

      /**
       * 延时消失
       */
      setTimeout(function () {
        animation.opacity(0).step()
        this.setData({
          animationData: animation.export(),
          show: false
        })
      }.bind(this), 2000)
    }
  }
})
