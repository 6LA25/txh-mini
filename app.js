
//app.js
import { getUserLocation, fetchCode } from './utils/util'
import { Fetch } from './utils/http'
import URL from './utils/url'
App({
  globalData: {
    hasAdvShow: false,
    hasClickAuth: false, // 是否已点击用户授权
    userInfo: null, // 微信授权后获取的用户信息
    sysUserInfo: null, // 项目用户信息
    locationInfo: null,
    code: '',
    ticket: '',
    searchText: '',
    hasSearch: false,
    recommendHouse: null, // 推荐楼盘id
    encryptedData: '',
    ivStr: '',
    inviteCode: '', // 上级推荐用户id
    inviteMobile: '', // 上级推荐用户联系方式
    scene: '',
    sharePostUrlCode: ''
  },
  onLaunch: function () {
    console.log('app onlaunch')
  },
  onShow(options) {
    console.log('app onshow', options)
    this.globalData.scene = options.scene
    // 暂时注释获取地址
    // getUserLocation(this)
  },
  onHide() {
    // Do something when hide.
  }
})