// pages/Secondary/pages/chatting/chatting.js
const app = getApp()
import { Fetch } from '../../../utils/http'
import { getUserDetail, fetchTicket } from '../../../utils/util'
import URL from '../../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    height: '',
    userId: 'TXH1591352906175',
    // userId: 'TXH1591352795921',
    contactMessages: {},
    conversionOptions: {},
    messagesLoading: false,
    count: 15,
    toLast: '',
    triggered: false,
    selectFileVisible: false,
    isInputAudio: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await getUserDetail(app)
    await fetchTicket(app)
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
      conversionOptions: {
        conversationID: options.conversationID,
        userID: options.userID,
        conversationType: options.conversationType
      }
    })
    if (app.globalData.isImLogin) {
      this.loadMessages({ conversationID: options.conversationID })
    } else {
      app.globalData.$tim.on(app.globalData.$$TIM.EVENT.SDK_READY, (event) => {
        console.log('eve', event)
        app.globalData.isImLogin = true
        // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
        // event.name - TIM.EVENT.SDK_READY
        this.loadMessages({ conversationID: options.conversationID })
      })
    }
    // 监听收到聊天信息
    wx.event.on('listenReceivedMsg', (receivedMsgs) => {
      console.log('receivedMsgs=>', receivedMsgs)
      let currentChat = receivedMsgs.find(item => {
        return item.conversationID === this.data.conversionOptions.conversationID
      })
      let { contactMessages } = this.data
      if (currentChat) {
        contactMessages.messageList.push(currentChat)
      }
      this.setData({
        contactMessages
      })
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
    wx.event.off('listenReceivedMsg')
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
  onPulling(e) {
    // console.log('onPulling:', e)
  },

  onRefresh() {
    if (this.data.contactMessages.isCompleted) {
      wx.showToast({
        title: '没有更多历史记录了',
        icon:'none'
      })
      this.setData({
        triggered: false
      })
    }
    if (this.data.messagesLoading || this.data.contactMessages.isCompleted) return
    // 下拉加载更多聊天记录
    this.loadMessages({
      conversationID: this.data.conversionOptions.conversationID,
      nextReqMessageID: this.data.contactMessages.nextReqMessageID
    })
  },

  onRestore(e) {
    // console.log('onRestore:', e)
  },

  onAbort(e) {
    // console.log('onAbort', e)
  },
  //获取普通文本消息
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 发送普通文本消息
  bindConfirm(e) {
    const { $tim } = app.globalData
    const { $$TIM } = app.globalData
    var content = this.data.inputValue
    console.log('send message=>', content)
    // 发送文本消息
    let message = $tim.createTextMessage({
      to: this.data.conversionOptions.userID,
      conversationType: this.data.conversionOptions.conversationType,
      payload: {
        text: content
      }
    });
    // 2. 发送消息
    let promise = $tim.sendMessage(message);
    promise.then((imResponse) => {
      // 发送成功
      console.log(imResponse);
      let contactMessages = this.data.contactMessages
      contactMessages.messageList.push(imResponse.data.message)
      this.setData({
        contactMessages,
        toLast: `msg-item-${contactMessages.messageList.length - 1}`,
        inputValue: '',
        isInputAudio: false,
        isInputText: false
      })
    }).catch(function (imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
    });
  },
  // 打开某个会话时，第一次拉取消息列表
  loadMessages(options) {
    this.setData({
      messagesLoading: true
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let tim = app.globalData.$tim
    let promise = tim.getMessageList({
      ...options,
      count: this.data.count
    });
    promise.then((imResponse) => {
      console.log('imResponse', imResponse.data)
      let contactMessages = {
        nextReqMessageID: imResponse.data.nextReqMessageID,
        isCompleted: imResponse.data.isCompleted,
        messageList: [...imResponse.data.messageList, ...(this.data.contactMessages.messageList || [])],
      }
      this.setData({
        contactMessages,
        toLast: !options.nextReqMessageID ? `msg-item-${imResponse.data.messageList.length - 1}` : '',
        messagesLoading: false,
        triggered: false,
      })
      wx.hideLoading()
    });
  },
  handleSelectFile() {
    if (!this.data.selectFileVisible) {
      wx.hideKeyboard()
    }
    this.setData({
      selectFileVisible: !this.data.selectFileVisible
    })
  },
  bindBlurInput() {
    this.setData({
      isInputText: !!this.data.inputValue
    })
  },
  bindFocusInput() {
    this.setData({
      isInputText: true,
      selectFileVisible: false
    })
  },
  handleToggleAudio() {
    this.setData({
      isInputAudio: !this.data.isInputAudio,
      selectFileVisible: false
    })
  }
})