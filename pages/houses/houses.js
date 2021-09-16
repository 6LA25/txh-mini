import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
const app = getApp()
const computedBehavior = require('miniprogram-computed')

Page({
  behaviors: [computedBehavior],
  data: {
    loadingHouses: false,
    currentFilter: '',
    userInfo: null,
    hasAuth: false,
    huxingJushi: [
      { name: '一居室', value: '1', checked: false },
      { name: '二居室', value: '2', checked: false },
      { name: '三居室', value: '3', checked: false },
      { name: '四居室', value: '4', checked: false },
      { name: '五居室及以上', value: '5', checked: false },
    ],
    huxingMianji: [
      { name: '50㎡以下', value: '1', checked: false },
      { name: '50-70㎡', value: '2', checked: false },
      { name: '70-90㎡', value: '3', checked: false },
      { name: '90-110㎡', value: '4', checked: false },
      { name: '110-130㎡', value: '5', checked: false },
      { name: '130-150㎡', value: '6', checked: false },
      { name: '150-200㎡', value: '7', checked: false },
      { name: '200㎡以上', value: '8', checked: false },
    ],
    // 装修
    fitments: [
      { name: '毛坯', value: '1', checked: false },
      { name: '带装修', value: '2', checked: false },
      { name: '毛坯&带装修', value: '3', checked: false },
      { name: '不限', value: '-1', checked: false },
    ],
    // 楼型
    houseTypes: [
      { name: '洋房', value: '7', checked: false },
      { name: '别墅', value: '8', checked: false },
      { name: '高层', value: '9', checked: false },
      { name: '小高层', value: '10', checked: false },
      { name: '住宅', value: '1', checked: false },
      { value: '2', name: '公寓', checked: false },
      { name: '商铺', value: '3', checked: false },
      { name: '写字楼', value: '4', checked: false },
      { value: '5', name: '厂房', checked: false },
      { value: '6', name: '车位', checked: false },
      { value: '11', name: '商业', checked: false },
      { value: '-1', name: '不限', checked: false }
    ],
    // 销售状态
    saleTypes: [
      { value: '7', name: '待售', checked: false },
      { value: '8', name: '认筹中', checked: false },
      { value: '4', name: '在售', checked: false },
      { value: '3', name: '售罄', checked: false }
    ],
    pageNo: 1,
    pageSize: 5,
    keyword: '', // 搜索文字
    priceSort: -1, // 价格排序
    housesList: [],
    totalHouses: '',
    areas: [], // 无锡 区
    selectedArea: false, // 不限区域
    selectedFitment: -1, // 选择装修
    selectedStatus: -1, // 选择销售状态
    selectedFloorType: [], // 选择楼型
    selectedAreas: '',
    toast: null,
    unitPrice: [],
    totalPrice: [],
    selectedPriceTabIndex: 1,
    selectedPriceList: [],
    totalPriceList: [
      { value: '1', name: '50万以下', checked: false },
      { value: '2', name: '50-100万', checked: false },
      { value: '3', name: '100-150万', checked: false },
      { value: '4', name: '150-200万', checked: false },
      { value: '5', name: '200-250万', checked: false },
      { value: '6', name: '250-300万', checked: false },
      { value: '7', name: '300-350万', checked: false },
      { value: '8', name: '350-400万', checked: false },
      { value: '9', name: '400-500万', checked: false },
      { value: '10', name: '500-600万', checked: false },
      { value: '11', name: '600-800万', checked: false },
      { value: '12', name: '800万以上', checked: false },
    ],
    unitPriceList: [
      { value: '1', name: '1万以下', checked: false },
      { value: '2', name: '1-1.5万', checked: false },
      { value: '3', name: '1.5-2万', checked: false },
      { value: '4', name: '2-2.5万', checked: false },
      { value: '5', name: '2.5-3万', checked: false },
      { value: '6', name: '3-3.5万', checked: false },
      { value: '7', name: '3.5-4万', checked: false },
      { value: '8', name: '4万以上', checked: false },
    ],
    featuresList: [
      { value: 1, name: '新盘', checked: false },
      { value: 2, name: '近期开盘', checked: false },
      { value: 3, name: '热销中', checked: false },
      { value: 4, name: '房源紧俏', checked: false },
      { value: 5, name: '限价盘', checked: false },
      { value: 6, name: '低总价', checked: false },
      { value: 7, name: '特价房', checked: false },
      { value: 8, name: '清盘特价', checked: false },
      { value: 9, name: '热搜盘', checked: false },
      { value: 10, name: '不限购', checked: false },
      { value: 11, name: '现房', checked: false },
      { value: -1, name: '不限', checked: false }
    ],
    selectedHuxingTabIndex: 1,
    selectedHouseFeatures: [],
    floorage: [],
    aptype: [],
  },
  computed: {
    isSelectedMore(data) {
      let { selectedFitment, selectedStatus, selectedFloorType, selectedHouseFeatures } = data
      return selectedFitment > 0 || selectedStatus > 0 || selectedFloorType.length > 0 || selectedHouseFeatures.length > 0
    }
  },
  onReady() {
    this.setData({
      toast: this.selectComponent("#toast")
    })
  },
  onShow() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        agentUser: app.globalData.sysUserInfo.agentUser
      })
    }
    if (app.globalData.hasClickAuth && !this.data.hasAuth) {
      this.setData({
        hasAuth: true
      })
    }
    this.setData({
      keyword: app.globalData.searchText
    }, () => {
      if (app.globalData.hasSearch) {
        this.searchHouses(this.resetSearch)
      }
    })
  },
  onHide() {
    app.globalData.hasSearch = false
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.searchHouses()
  },
  onShareAppMessage: function (e) {
    console.log('e.target.dataset', e.target.dataset)
    let id = e.target.dataset.id
    let name = e.target.dataset.name
    let cover = e.target.dataset.cover
    Fetch({
      houseId: id
    }, URL.addShareCount, app).then(({ data }) => { })
    return {
      title: name,
      path: `/pages/house-detail/index?id=${id}&inviteCode=${app.globalData.sysUserInfo.userCode}&inviteMobile=${app.globalData.sysUserInfo.phoneNumber}`,
      imageUrl: cover
    }
  },
  onLoad: function (options) {
    console.log(options)
    wx.hideShareMenu();
    this.setData({
      userInfo: app.globalData.userInfo,
      hasAuth: app.globalData.hasAuth,
    })
    if (!app.globalData.hasSearch) {
      this.searchHouses()
    }
    this.makePriceList()
  },
  // 获取无锡-> 区
  fetchWuXiAreas() {
    wx.showLoading({
      title: '区域加载中...'
    })
    Fetch({}, URL.areas, app).then(({ data }) => {
      let selecteds = this.data.selectedAreas.split(',')
      data.items.forEach((item) => {
        if (selecteds.includes(String(item.id))) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      this.setData({
        areas: data.items
      })
      wx.hideLoading()
    })
  },
  resetSearch() {
    this.setData({
      pageNo: 1,
      housesList: [],
      totalHouses: ''
    })
  },
  makePriceList() {
    let priceType = this.data.selectedPriceTabIndex / 1
    let priceList = priceType === 1 ? this.data.totalPriceList : this.data.unitPriceList
    this.setData({
      selectedPriceList: JSON.parse(JSON.stringify(priceList))
    })
  },
  handleSelectPriceType(e) {
    console.log(e.currentTarget)
    let priceType = e.currentTarget.dataset.priceType / 1
    this.setData({
      selectedPriceTabIndex: priceType,
    }, () => {
      this.makePriceList()
      let selectedPriceList = this.data.selectedPriceList
      selectedPriceList.forEach(item => {
        let selectedPrices = priceType === 1 ? this.data.totalPrice : this.data.unitPrice
        if (selectedPrices.includes(item.value)) {
          item.checked = true
        }
      })
      this.setData({
        selectedPriceList
      })
    })
  },
  handleSelectHuxingType(e) {
    console.log(e.currentTarget)
    let huxingType = e.currentTarget.dataset.huxingType / 1
    this.setData({
      selectedHuxingTabIndex: huxingType
    }, () => {
    })
  },
  handleSelectNewHuxing(e) {
    let value = e.currentTarget.dataset.value
    let str = this.data.selectedHuxingTabIndex === 1 ? 'huxingMianji' : 'huxingJushi'
    let list = this.data[str]
    list.forEach(item => {
      if (item.value === value) {
        item.checked = !item.checked
      }
    })
    this.setData({
      [str]: list
    })
  },
  handleResetHuxing() {
    let { huxingJushi, huxingMianji } = this.data
    huxingJushi.forEach(item => {
      item.checked = false
    })
    huxingMianji.forEach(item => {
      item.checked = false
    })
    this.setData({
      selectedHuxingTabIndex: 1,
      huxingJushi,
      huxingMianji,
      floorage: [],
      aptype: [],
    }, () => {
      this.searchHouses(this.resetSearch)
      this.handleClosePop()
    })
  },
  // 搜索楼盘
  searchHouses(reset) {
    console.log('====> 发起搜索')
    if (this.data.loadingHouses) {
      return
    }
    if (reset) {
      reset()
    }
    if (this.data.housesList.length === this.data.totalHouses) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loadingHouses: true
    })
    Fetch({
      fitment: this.data.selectedFitment, // 装修类型
      floorType: [], // 楼型
      estateType: this.data.selectedFloorType, // 
      status: this.data.selectedStatus, // 楼盘销售状态
      priceSort: this.data.priceSort, // 价格排序
      keyword: this.data.keyword, // 搜索关键词
      region: this.data.selectedAreas, // 区域
      houseFeatures: this.data.selectedHouseFeatures,
      unitPrice: this.data.unitPrice,
      totalPrice: this.data.totalPrice,
      floorage: this.data.floorage,
      aptype: this.data.aptype,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize
    }, URL.searchHouse, app).then(({ data }) => {
      let housesList = this.data.housesList
      housesList.push(...data.items)
      this.setData({
        housesList,
        totalHouses: data.totalCount,
        loadingHouses: false
      })
      wx.hideLoading()
      // 提示搜索到的楼盘
      if (this.data.pageNo === 1 && data.totalCount > 0) {
        this.data.toast.showToast(`为您找到${data.totalCount}个楼盘`);
      }
      if (housesList.length < data.totalCount) {
        let pageNo = this.data.pageNo
        pageNo = pageNo + 1
        this.setData({
          pageNo
        })
      }
    })
  },
  handleFilter(e) {
    let index = e.currentTarget.dataset.index / 1
    if (index === 0) {
      this.fetchWuXiAreas()
    } else if (index === 1) { // 单价排序
      if (this.data.loadingHouses) {
        return
      }
      let priceSort = this.data.priceSort
      if (priceSort === -1) { // 默认排序，点击转为升序
        priceSort = 0
      } else if (priceSort === 0) { // 升序点击转为降序
        priceSort = 1
      } else if (priceSort === 1) { // 降序点击转为默认排序
        priceSort = -1
      }
      this.setData({
        priceSort
      }, () => {
        this.searchHouses(this.resetSearch)
      })
    }
    this.setData({
      currentFilter: index === this.data.currentFilter ? '' : index
    })
  },
  // 选择区域
  handleSelectArea(e) {
    let id = e.currentTarget.dataset.id
    this.data.areas.forEach((item, index) => {
      let change = "areas[" + index + "].checked"
      if (item.id === id) {
        console.log(!item.checked)
        this.setData({
          [change]: !item.checked
        })
      }
    })
    let selected = this.data.areas.filter(item => {
      return item.checked
    })
    if (selected.length) {
      this.setData({
        selectedArea: false
      })
    }
  },
  handleSelectPrice(e) {
    let { value } = e.currentTarget.dataset
    let selectedPriceList = this.data.selectedPriceList
    selectedPriceList.forEach(item => {
      if (item.value === value) {
        item.checked = !item.checked
      }
    })
    this.setData({
      selectedPriceList
    })
  },
  handleToggleAllArea() {
    this.setData({
      selectedArea: !this.data.selectedArea
    })
    this.data.areas.forEach((item, index) => {
      let change = "areas[" + index + "].checked"
      this.setData({
        [change]: false
      })
    })
  },
  handleResetArea() {
    this.data.areas.forEach((item, index) => {
      let change = "areas[" + index + "].checked"
      this.setData({
        [change]: false
      })
    })
    this.setData({
      selectedAreas: '',
      selectedArea: false
    }, () => {
      this.searchHouses(this.resetSearch)
      this.handleClosePop()
    })
  },
  handleResetPrices() {
    this.setData({
      selectedPriceTabIndex: 1
    })
    this.makePriceList()
    let selectedPriceList = this.data.selectedPriceList
    selectedPriceList.forEach(item => {
      item.checked = false
    })
    this.setData({
      selectedPriceList,
      unitPrice: [],
      totalPrice: []
    }, () => {
      this.searchHouses(this.resetSearch)
      this.handleClosePop()
    })
  },
  // 选择楼型
  handleSelectHouseType(e) {
    let value = e.currentTarget.dataset.value
    let _houseTypes = JSON.parse(JSON.stringify(this.data.houseTypes))
    if (value !== '-1') {
      _houseTypes.forEach(item => {
        if (item.value === value) {
          item.checked = !item.checked
        }
      })
      if (_houseTypes.filter(item => { return item.checked }).length > 0) {
        _houseTypes[_houseTypes.length - 1].checked = false
      }
    } else {
      _houseTypes.forEach(item => {
        if (item.value === value) {
          item.checked = !item.checked
        } else {
          item.checked = false
        }
      })
    }
    this.setData({
      houseTypes: _houseTypes
    })
  },
  handleSelectHouseFeatures(e) {
    let value = e.currentTarget.dataset.value
    let _houseTypes = JSON.parse(JSON.stringify(this.data.featuresList))
    if (value !== -1) {
      _houseTypes.forEach(item => {
        if (item.value === value) {
          item.checked = !item.checked
        }
      })
      if (_houseTypes.filter(item => { return item.checked }).length > 0) {
        _houseTypes[_houseTypes.length - 1].checked = false
      }
    } else {
      _houseTypes.forEach(item => {
        if (item.value === value) {
          item.checked = !item.checked
        } else {
          item.checked = false
        }
      })
    }
    this.setData({
      featuresList: _houseTypes
    })
  },
  handleConfirmArea() {
    let selected = this.data.areas.filter(item => {
      return item.checked
    })
    let result = selected.map(obj => { return obj.id })
    this.setData({
      selectedAreas: result.join(',')
    }, () => {
      this.searchHouses(this.resetSearch)
      this.handleClosePop()
    })
  },
  handleConfirmHuxing() {
    let { huxingMianji, huxingJushi } = this.data
    let floorage = []
    let aptype = []
    huxingMianji.forEach(item => {
      if (item.checked) {
        floorage.push(item.value)
      }
    })
    huxingJushi.forEach(item => {
      if (item.checked) {
        aptype.push(item.value)
      }
    })
    this.setData({
      floorage,
      aptype
    })
    this.searchHouses(this.resetSearch)
    this.handleClosePop()
  },
  handleConfirmPrices() {
    let selectedPriceValues = []
    this.data.selectedPriceList.forEach(item => {
      if (item.checked) {
        selectedPriceValues.push(item.value)
      }
    })
    if (this.data.selectedPriceTabIndex === 1) {
      this.setData({
        totalPrice: selectedPriceValues
      })
    } else {
      this.setData({
        unitPrice: selectedPriceValues
      })
    }
    this.searchHouses(this.resetSearch)
    this.handleClosePop()
  },
  // 选择装修
  handleSelectFitment(e) {
    console.log('===> 点击更多->装修')
    let selected = e.currentTarget.dataset.value
    let fitments = this.data.fitments
    fitments.forEach(fit => {
      if (fit.value === selected) {
        fit.checked = true
      } else {
        fit.checked = false
      }
    })
    console.log('===> 装修', fitments)
    this.setData({
      fitments
    })
  },
  // 选择销售状态
  handleSelectSaleType(e) {
    console.log('===> 点击更多->销售状态')
    let selected = e.currentTarget.dataset.value
    let saleTypes = this.data.saleTypes
    saleTypes.forEach(sale => {
      sale.checked = selected.includes(sale.value)
    })
    console.log('===> 销售状态', saleTypes)
    this.setData({
      saleTypes
    })
  },
  // 只修改样式
  handleResetMore() {
    console.log('===> 点击更多->重置')
    let { houseTypes, featuresList } = this.data
    // 修改选中装修样式
    let fitments = JSON.parse(JSON.stringify(this.data.fitments))
    fitments.forEach(item => {
      item.checked = false
    })
    houseTypes.forEach(item => {
      item.checked = false
    })
    // 修改选中销售状态样式
    let saleTypes = JSON.parse(JSON.stringify(this.data.saleTypes))
    saleTypes.forEach(item => {
      item.checked = false
    })
    featuresList.forEach(item => {
      item.checked = false
    })
    console.log('===> 重置数据', this.data.fitments, this.data.types, this.data.saleTypes)
    this.setData({
      fitments,
      saleTypes,
      houseTypes,
      featuresList
    }, () => {
      this.handleConfirmMore()
    })
  },
  // 确认选择
  handleConfirmMore() {
    console.log('===> 点击更多->确定')
    let selectedFitment = this.data.fitments.find(fit => {
      return fit.checked
    }) || {}
    let selectedStatus = this.data.saleTypes.find(status => {
      return status.checked
    }) || {}
    let selectedFloorType = []
    this.data.houseTypes.forEach(item => {
      if (item.checked && item.value !== '-1') {
        selectedFloorType.push(item.value)
      }
    })
    let selectedHouseFeatures = []
    this.data.featuresList.forEach(item => {
      if (item.checked && item.value !== -1) {
        selectedHouseFeatures.push(item.value)
      }
    })

    this.setData({
      selectedFitment: selectedFitment.value || '-1',
      selectedStatus: selectedStatus.value || '-1',
      selectedFloorType,
      selectedHouseFeatures
    }, () => {
      console.log('点击更多->确定->搜索数据')
      this.searchHouses(this.resetSearch)
      this.handleClosePop()
    })
  },
  handleClosePop(e) {
    this.setData({
      currentFilter: ''
    })
  },
  // 分享前授权，后重新获取ticket
  onMyEvent(e) {
    this.setData({
      hasAuth: true
    })
  },
  handleJumpSearch() {
    wx.navigateTo({
      url: '../search-house/search-house'
    })
  }
})