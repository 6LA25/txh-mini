
//app.js
import { getUserLocation, fetchCode } from './utils/util'
import { Fetch } from './utils/http'
import URL from './utils/url'
// import TIMUploadPlugin from 'tim-upload-plugin';
const TIM = require('./common/sdk/tim-wx.js')
const TIMUploadPlugin = require('./common/sdk/tim-upload-plugin.js')
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
    sharePostUrlCode: '',
    $tim: null,
    $$TIM: TIM
  },
  onLaunch: function () {
    console.log('app onlaunch')
    let options = {
      SDKAppID: 1400511488 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
    }
    // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
    let tim = TIM.create(options) // SDK 实例通常用 tim 表示
    // 设置 SDK 日志输出级别，详细分级请参见 <a href="https://web.sdk.qcloud.com/im/doc/zh-cn//SDK.html#setLogLevel">setLogLevel 接口的说明</a>
    tim.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
    // tim.setLogLevel(1) // release 级别，SDK 输出关键信息，生产环境时建议使用
    // 注册腾讯云即时通信 IM 上传插件
    tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
    this.globalData.$tim = tim
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