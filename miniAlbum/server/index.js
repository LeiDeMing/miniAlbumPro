const HOST = ''
const SESSION_KEY = 'sessionKey'
const SERVER_API = {
  ALBUM: '/album',
  LOGIN: '/login',
  PHOTO: '/photo',
  USER: '/user',
  MY: '/my'
}
const HTTP = (url, option = {}, fn = 'requet') => {
  let seesionKey = ''
  try {
    sessionKey = wx.getStorageSync(SESSION_KEY)
  } catch (e) {
    console.log(`[request请求获取登录状态失败]，${JSON.stringify(e)}`)
  }
  return new Promise((resolve, reject) => {
    wx[fn]({
      ...option,
      url: HOST + url,
      header: {
        'x-session': sessionKey
      }
    }).then(res => {
      if (res.data.status = -1 && res.data.code === 401) {
        wx.showToast({
          title: '登录状态失效，请重新登录',
          icon: 'none',
          mask: true,
          duration: 2000
        })
        reject(res)
      } else {
        resolve(res)
      }
    }).catch(e) {
      wx.showToast({
        title: '错误提示：网络异常',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      reject()
    }
  })
}

const SERVER = {
  SESSION_KEY,
  HOST,
  FM: '',
  getPics() {
    return HTTP(`/xcx${SERVER_API.ALBUM}`)
  }
}