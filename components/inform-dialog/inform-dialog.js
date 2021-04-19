// components/inform-dialog.js
const computedBehavior = require('miniprogram-computed')
const app = getApp()
import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
Component({
  /**
   * 组件的属性列表
   */
  behaviors: [computedBehavior],
  properties: {
    dialogShow: {
      type: Boolean,
      value: false
    },
    informType: {
      type: String,
      value: ''
    },
    houseId: {
      type: String,
      value: ''
    }
  },
  computed: {
    text1(data) {
      if (data.informType == '2') {
        return '开盘通知'
      } else if (data.informType == '3') {
        return '变价通知'
      } else if (data.informType == '5') {
        return '获取实时动态'
      }
    },
    text2(data) {
      if (data.informType == '2') {
        return '您将及时获取开盘或加推信息'
      } else if (data.informType == '3') {
        return '您将第一时间获取楼盘优惠活动和价格变动信息'
      } else if (data.informType == '5') {
        return '怕错过开盘时间、限时折扣、特价房信息？ 有新动态咨询师第一时间通知您'
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    inputValue: '',
    submitting: false,
    toast: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindKeyInput: function (e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    handleClose() {
      this.triggerEvent('myCloseInformDialog', null, {})
    },
    handleConfirm() {
      if (!this.data.inputValue || this.data.submitting) {
        return
      }
      this.setData({
        submitting: true
      })
      Fetch({
        realname: '',
        mobile: this.data.inputValue,
        houseId: this.data.houseId,
        type: this.data.informType,
        inviteCode: app.globalData.inviteCode
      }, URL.recommend, app).then(({data}) => {
        this.setData({
          submitting: false,
          inputValue: ''
        })
        // this.handleClose()
        this.triggerEvent('myComfirmMobile', null, {})
      }).catch((error) => {
        this.setData({
          inputValue: '',
          submitting: false
        })
        this.selectComponent("#toast").showToast('操作失败：' + error.result_msg);
      })
    }
  }
})
