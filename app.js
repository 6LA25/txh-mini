
//app.js
import { getUserLocation, fetchCode } from './utils/util'
import { Fetch } from './utils/http'
import URL from './utils/url'
import Event from './utils/event.js'
// import TIMUploadPlugin from 'tim-upload-plugin';
const TIM = require('./common/sdk/tim-wx.js')
const TIMUploadPlugin = require('./common/sdk/tim-upload-plugin.js')
wx.event=new Event()
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
    $$TIM: TIM,
    isImLogin: false
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

// 安选好房小程序交付优化点：
// 1. 顶部状态栏滚动过渡间距调低
// 2. 楼盘列表我的收藏星图标样式优化
// 3. ‘我的’内加入口跳转至关注楼盘，星标调整至右上角，关注楼盘列表内可取消关注
// 4.楼盘列表分享区域整体调整的更紧凑
// 5. 首页-查看更多楼盘按钮高度降低
// 6. 地图看房图标变小
// 7. 楼盘详情-热门活动图片高度降低
// 8. 楼盘详情-结佣以推荐时的佣金方案为准替换：结佣以成交时的佣金方案为准
// 9. 楼盘详情底部菜单栏添加一个与助手聊天的按钮‘在线咨询’，助手在楼盘详情配置更改为选员工，后台‘咨询电话’改为‘楼盘助手’
// 10. 楼盘详情-聊天用户头像缩小，做个区间隔断，变紧凑，头像加阴影
// 11. 楼盘详情-专业放心改为：高效省钱买好房
// 12. 发展经纪人，直击点击拨打电话
// 13. 首页整体变紧凑
// 14. 佣字，分享图标优化
// 15. 头条列表页添加点击事件到详情
// 16. 语音没有声音，需修复
// 17. 在线咨询标题改为 ‘消息’
// 18. 首页楼盘列表样式参照房车宝优化
// 19. 首页滚动消息点击后进详情
// 20. 聊天发送图片，视频图片样式调整