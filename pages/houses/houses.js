import { Fetch } from '../../utils/http'
import URL from '../../utils/url'
const app = getApp()
Page({
  data: {
    loadingHouses: false,
    currentFilter: '',
    userInfo: null,
    hasAuth: false,
    // 房型
    types: [{
      name: '一居室',
      value: '1',
      checked: false
    },
    {
      name: '二居室',
      value: '2',
      checked: false
    },
    {
      name: '三居室',
      value: '3',
      checked: false
    },
    {
      name: '四居室',
      value: '4',
      checked: false
    },
    {
      name: '五居室以上',
      value: '5',
      checked: false
    },
    ],
    // 装修
    fitments: [{
      name: '毛坯房',
      value: '1',
      checked: false
    },
    {
      name: '精装修',
      value: '2',
      checked: false
    },
    ],
    // 楼型
    houseTypes: [
      {
        name: '高层',
        value: '1',
        checked: false
      },
      {
        name: '小高层',
        value: '2',
        checked: false
      },
      {
        name: '洋房',
        value: '3',
        checked: false
      },
      {
        name: '别墅',
        value: '4',
        checked: false
      },
      {
        name: '写字楼',
        value: '5',
        checked: false
      },
      {
        name: '商铺',
        value: '6',
        checked: false
      },
      {
        value: '7',
        name: '公寓',
        checked: false
      },
      {
        value: '8',
        name: '厂房',
        checked: false
      },
      {
        value: '10',
        name: '车位',
        checked: false
      },
      {
        value: '9',
        name: '其他',
        checked: false
      },
      {
        value: '-1',
        name: '不限',
        checked: false
      }
    ],
    // 销售状态
    saleTypes: [
      {
        value: '1',
        name: '热销中',
        checked: false
      },
      {
        value: '4',
        name: '即将加推',
        checked: false
      },
      {
        value: '5',
        name: '即将首开',
        checked: false
      },
      {
        value: '2',
        name: '即将开盘',
        checked: false
      },
      {
        value: '6',
        name: '即将售罄',
        checked: false
      },
      {
        value: '3',
        name: '售罄',
        checked: false
      }
      // {
      //   name: '在售',
      //   value: '1',
      //   checked: false
      // },
      // {
      //   name: '待售',
      //   value: '2',
      //   checked: false
      // },
      // {
      //   name: '售罄',
      //   value: '3',
      //   checked: false
      // }
    ],
    pageNo: 1,
    pageSize: 5,
    keyword: '', // 搜索文字
    priceSort: -1, // 价格排序
    housesList: [],
    totalHouses: '',
    areas: [], // 无锡 区
    selectedArea: false, // 不限区域
    selectedApartments: [], // 选择的房型
    selectedFitment: -1, // 选择装修
    selectedStatus: -1, // 选择销售状态
    selectedFloorType: [], // 选择楼型
    isSelectedMore: false, // 更多是否被选中
    selectedAreas: '',
    toast: null
  },
  onReady() {
    this.setData({
      toast: this.selectComponent("#toast")
    })
    console.log(this.selectComponent("#toast"))
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
    console.log('hide')
    app.globalData.hasSearch = false
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('end')
    this.searchHouses()
  },
  onShareAppMessage: function (e) {
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
      hasAuth: app.globalData.hasAuth
    })
    if (!app.globalData.hasSearch) {
      this.searchHouses()
    }
  },
  // 获取无锡-> 区
  fetchWuXiAreas() {
    wx.showLoading({
      title: '区域加载中...'
    })
    Fetch({}, URL.areas, app).then(({ data }) => {
      let selecteds = this.data.selectedAreas.split(',')
      console.log(selecteds)
      data.items.forEach((item) => {
        if (selecteds.includes(String(item.id))) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      console.log(data.items)
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
      floorType: this.data.selectedFloorType, // 楼型
      status: this.data.selectedStatus, // 楼盘销售状态
      priceSort: this.data.priceSort, // 价格排序
      keyword: this.data.keyword, // 搜索关键词
      region: this.data.selectedAreas, // 区域
      apartments: this.data.selectedApartments, // 房型
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
  handleResetHouseType() {
    // 修改选中楼型样式
    this.data.houseTypes.forEach((item, index) => {
      let change = "houseTypes[" + index + "].checked"
      this.setData({
        [change]: false
      })
    })
    this.setData({
      selectedFloorType: []
    }, () => {
      this.searchHouses(this.resetSearch)
      this.handleClosePop()
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
  handleConfirmHouseType() {
    let selectedFloorType = []
    this.data.houseTypes.forEach(type => {
      if (type.checked && type.value !== '-1') {
        selectedFloorType.push(type.value)
      }
    })
    this.setData({
      selectedFloorType
    }, () => {
      this.searchHouses(this.resetSearch)
      this.handleClosePop()
    })
  },
  // 选择装修
  handleSelectFitment(e) {
    console.log('===> 点击更多->装修')
    let selected = e.currentTarget.dataset.value
    let fitments = this.data.fitments
    fitments.forEach(fit => {
      fit.checked = selected.includes(fit.value)
    })
    console.log('===> 装修', fitments)
    this.setData({
      fitments
    })
  },
  // 选择户型
  handleSelectHuxing(e) {
    console.log('===> 点击更多->户型')
    let value = e.currentTarget.dataset.value
    let types = this.data.types
    types.forEach((item) => {
      if (value == item.value) {
        item.checked = !item.checked
      }
    })
    this.setData({
      types
    })
    console.log('===> 户型', this.data.types)

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
    // 修改选中装修样式
    let fitments = JSON.parse(JSON.stringify(this.data.fitments))
    fitments.forEach(item => {
      item.checked = false
    })
    // 重置户型
    let types = JSON.parse(JSON.stringify(this.data.types))
    types.forEach(item => {
      item.checked = false
    })
    // 修改选中销售状态样式
    let saleTypes = JSON.parse(JSON.stringify(this.data.saleTypes))
    saleTypes.forEach(item => {
      item.checked = false
    })
    console.log('===> 重置数据', this.data.fitments, this.data.types, this.data.saleTypes)
    this.setData({
      fitments,
      types,
      saleTypes
    }, () => {
      this.handleConfirmMore()
    })
  },
  // 确认选择
  handleConfirmMore() {
    console.log('===> 点击更多->确定')
    let selectedFitment = this.data.fitments.find(fit => {
      return fit.checked
    })
    let selectedStatus = this.data.saleTypes.find(status => {
      return status.checked
    })

    let selectedApartments = []
    this.data.types.forEach(type => {
      if (type.checked) {
        selectedApartments.push(type.value)
      }
    })
    console.log('===> 确定数据', selectedFitment, selectedStatus, selectedApartments)
    this.setData({
      selectedFitment: selectedFitment ? selectedFitment.value : '-1',
      selectedStatus: selectedStatus ? selectedStatus.value : '-1',
      selectedApartments
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