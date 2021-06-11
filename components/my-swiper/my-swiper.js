Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    },
    imgList: {
      type: Array,
      value: []
    },
    radius: {
      type: Number,
      value: 0
    },
    height: {
      type: Number,
      value: 320
    },
    dotsBottom: {
      type: Number,
      value: 16
    },
    dotsVisible: {
      type: Boolean,
      value: true
    },
    isClickJump: {
      type: Boolean,
      value: true
    },
    recordVisible: {
      type: Boolean,
      value: false
    },
  },
  data: {
    // 这里是一些组件内部数据
    currentSwiper: 0,
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    indicatorColor: '#FFFFFF',
    indicatorActiveColor: 'blue',
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function () {},
    handleTap(data) {
      if (!this.data.isClickJump) {
        return
      }
      let dataset = data.currentTarget.dataset
      console.log(data.currentTarget.dataset)
      if (dataset.type === 1) {
        wx.navigateTo({
          url: `../house-detail/index?id=${dataset.link}`
        })
      } else {
        wx.navigateTo({
          url: `../out/out?url=${dataset.link}`
        })
      }
    },
    swiperChange: function (e) {
      this.setData({
        currentSwiper: e.detail.current
      })
    }
  }
})