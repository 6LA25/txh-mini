// pages/Secondary/pages/chatting/chatting.js
const app = getApp()
import { Fetch } from '../../../utils/http'
import { getUserDetail, fetchTicket } from '../../../utils/util'
import URL from '../../../utils/url'
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
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
    isInputAudio: false,
    voiceStatusStr: '按住 说话',
    canSend: false,
    startPoint: null
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
    // 监听聊天信息已读
    wx.event.on('listenMsgReaded', (readedMsgs) => {
      let { contactMessages } = this.data
      readedMsgs.forEach(item => {
        contactMessages.messageList.forEach(msg => {
          if (item.ID === msg.ID) {
            msg.isPeerRead = true
          }
        })
      })
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
    innerAudioContext.destroy()
    wx.event.off('listenReceivedMsg')
    wx.event.off('listenMsgReaded')
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
        icon: 'none'
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
  updateSendMsgToList(imResponse) {
    let contactMessages = this.data.contactMessages
    contactMessages.messageList.push(imResponse.data.message)
    this.setData({
      contactMessages,
      toLast: `msg-item-${contactMessages.messageList.length - 1}`
    })
  },
  // 发送普通文本消息
  handleSendText(e) {
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
      this.updateSendMsgToList(imResponse)
      this.setData({
        inputValue: '',
        isInputAudio: false,
        isInputText: false
      })
    }).catch(function (imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
    });
  },
  // 发送图片
  handleSendImg() {
    const { $tim } = app.globalData
    const { $$TIM } = app.globalData
    wx.chooseImage({
      sourceType: ['album', 'camera'], // 从相册选择
      count: 1, // 只选一张，目前 SDK 不支持一次发送多张图片
      success: (res) => {
        // 2. 创建消息实例，接口返回的实例可以上屏
        let message = $tim.createImageMessage({
          to: this.data.conversionOptions.userID,
          conversationType: this.data.conversionOptions.conversationType,
          payload: { file: res },
          onProgress: (event) => { console.log('file uploading:', event) }
        });
        // 3. 发送图片
        let promise = $tim.sendMessage(message);
        promise.then((imResponse) => {
          // 发送成功
          console.log(imResponse);
          this.updateSendMsgToList(imResponse)
          this.setData({
            inputValue: '',
            isInputAudio: false,
            isInputText: false,
            selectFileVisible: false
          })
        }).catch(function (imError) {
          // 发送失败
          console.warn('sendMessage error:', imError);
        });
      }
    })
  },
  // 发送视频
  handleSendVideo() {
    const { $tim, $$TIM } = app.globalData
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        console.log(res.tempFilePath)
        // 2. 创建消息实例，接口返回的实例可以上屏
        let message = $tim.createVideoMessage({
          to: this.data.conversionOptions.userID,
          conversationType: this.data.conversionOptions.conversationType,
          payload: {
            file: res
          },
          onProgress: function (event) { console.log('video uploading:', event) }
        })
        // 3. 发送消息
        let promise = $tim.sendMessage(message);
        promise.then((imResponse) => {
          // 发送成功
          this.updateSendMsgToList(imResponse)
          this.setData({
            inputValue: '',
            isInputAudio: false,
            isInputText: false,
            selectFileVisible: false
          })
        }).catch(function (imError) {
          // 发送失败
          console.warn('sendMessage error:', imError);
        });
      }
    })
  },
  handlePlayVoice(e) {
    const { voice } = e.currentTarget.dataset
    let { contactMessages } = this.data
    if (!voice.playing) {
      contactMessages.messageList.forEach(item => {
        if (item.ID === voice.ID) {
          item.playing = true
        } else {
          item.playing = false
        }
      })
      innerAudioContext.src = voice.payload.remoteAudioUrl
      innerAudioContext.play()
      innerAudioContext.onEnded((res) => {
        console.log('end=>', res)
        contactMessages.messageList.forEach(item => {
          if (item.ID === voice.ID) {
            item.playing = false
          }
        })
        this.setData({
          contactMessages
        })
      })
    } else {
      contactMessages.messageList.forEach(item => {
        if (item.ID === voice.ID) {
          item.playing = false
        }
      })
      innerAudioContext.stop()
    }
    this.setData({
      contactMessages
    })

  },
  handleTouchMove(e) {
    //计算距离，当滑动的垂直距离大于25时，则取消发送语音
    if (Math.abs(e.touches[e.touches.length - 1].clientY - this.data.startPoint.clientY) > 25) {
      this.setData({
        voiceStatusStr: '按住 说话',
        canSend: false//设置为不发送语音
      })
    }
  },
  handleStartRecordVoice(e) {
    console.log('e.touches[0]', e.touches[0])
    this.setData({
      canSend: true,
      startPoint: e.touches[0],//记录触摸点的坐标信息
    })
    const options = {
      duration: 60 * 1000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }
    recorderManager.start(options)
    this.setData({
      voiceStatusStr: '松开 结束'
    })
  },
  handleEndRecordVoice() {
    recorderManager.stop();
    const { canSend } = this.data
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const { tempFilePath, duration } = res
      if (canSend && duration > 2000) {
        const { $tim, $$TIM } = app.globalData
        const message = $tim.createAudioMessage({
          to: this.data.conversionOptions.userID,
          conversationType: $$TIM.TYPES.CONV_C2C,
          payload: {
            file: res
          }
        });
        // 5. 发送消息
        let promise = $tim.sendMessage(message);
        promise.then((imResponse) => {
          // 发送成功
          console.log('voice=>', imResponse);
          this.updateSendMsgToList(imResponse)
          this.setData({
            voiceStatusStr: '按住 说话'
          })
        }).catch(function (imError) {
          // 发送失败
          console.warn('sendMessage error:', imError);
        });
      } else if (!canSend) {
        this.setData({
          voiceStatusStr: '按住 说话'
        })
        wx.showToast({
          title: '取消发送',
          icon: 'none',
          duration: 1000
        })
      } else if (duration < 2000) {
        this.setData({
          voiceStatusStr: '按住 说话'
        })
        wx.showToast({
          title: '录音时间太短，请长按录音',
          icon: 'none',
          duration: 1000
        })
      }
      // console.log('tempFilePath=>', tempFilePath)
    })
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
      console.log('loadMessages =>', imResponse.data)
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