const app = getApp()
Component({
  data: {
    agentUser: false,
    selected: 0,
    color: "#999999",
    selectedColor: "#E32835",
    list: [{
      pagePath: "../index/index",
      iconPath: "/image/home_icon_home_default@2x.png",
      selectedIconPath: "/image/home_icon_home_click@2x.png",
      text: "首页"
    },
    {
      pagePath: "../houses/houses",
      iconPath: "/image/home_icon_building_default@2x.png",
      selectedIconPath: "/image/home_icon_building_click@2x.png",
      text: "楼盘"
    },{
      pagePath: "../consult-online/consult",
      iconPath: "/image/home_icon_building_default@2x.png",
      selectedIconPath: "/image/home_icon_building_click@2x.png",
      text: "发现"
    }, {
      pagePath: "../recommend/index",
      iconPath: "/image/home_icon_rec_default@2x.png",
      selectedIconPath: "/image/home_icon_rec_click@2x.png",
      text: "推荐"
    }, {
      pagePath: "../center/center",
      iconPath: "/image/home_icon_my_default@2x.png",
      selectedIconPath: "/image/home_icon_my_click@2x.png",
      text: "我的"
    }]
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      console.log('tab show')
    },
    hide: function () { },
    resize: function () { },
  },
  ready: function () {
    console.log('tab ready')
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 1] //获取当前页面的对象
      var currentUrl = currentPage.route //当前页面url
      if (currentUrl === 'pages/index/index' && app.globalData.sysUserInfo && app.globalData.sysUserInfo.agreement !== 1) {
        return
      }
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
    }
  }
})