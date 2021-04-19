export function Fetch (ajaxOptions = {}, url, app) {
  return new Promise((resolve, reject) => {
    wx.request({
      url, //仅为示例，并非真实的接口地址
      data: {
        ...ajaxOptions
      },
      header: {
        'content-type': 'application/json', // 默认值
        'Authorization': app.globalData.ticket
      },
      method: 'POST',
      success(res) {
        if (res.data.result_code === 1000) {
          resolve(res.data)
        } else {
          // ticket失效，跳转至首页重新登录
          if (res.data.result_code === 401 && res.data.result_msg=== '未登录') {
            wx.showModal({
              title: '提示',
              showCancel:false,
              content: '登录过期，请重新登录',
              success (res) {
                console.log('用户点击确定')
                wx.reLaunch({
                  url: '../index/index'
                })
              }
            })
          }
          wx.hideLoading()
          reject(res.data)
        }
      },
      fail(error) {
        reject(error)
      }
    })
  })
}