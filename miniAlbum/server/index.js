const HOST = 'http://192.168.2.159:3389'
const SESSION_KEY = 'sessionKey'
const SERVER_API = {
  ALBUM: '/album',
  LOGIN: '/login',
  PHOTO: '/photo',
  USER: '/user',
  MY: '/my'
}
const HTTP = (url, option = {}, fn = 'request') => {
  let sessionKey = ''
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
      if (res.data.status === -1 && res.data.code === 401) {
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
    }).catch(e => {
      wx.showToast({
        title: '错误提示：网络异常',
        icon: 'none',
        mask: true,
        duration: 2000
      })
      reject()
    })
  })
}

const SERVER = {
  SESSION_KEY,
  HOST,
  FM: '../../assets/fengmian.png',
  getPics() {
    return HTTP(`/xcx${SERVER_API.ALBUM}`)
  },
  addPics(name) {
    return HTTP(SERVER_API.ALBUM, {
      method: 'post',
      data: {
        name
      }
    })
  },
  getPic(id) {
    return HTTP(`/xcx${SERVER_API.ALBUM}/${id}`)
  },
  addPic(opt) {
    return HTTP(SERVER_API.PHOTO, opt, 'uploadFile')
  },
  scanCode(code) {
    return HTTP(`/login/ercode/${code}`)
  },
  updateUserInfo(data) {
    return HTTP(`${SERVER_API.USER}`, {
      method: 'put',
      data
    })
  },
  getCurrentUserInfo() {
    return HTTP(`${SERVER_API.MY}`, {
      method: 'get'
    })
  },
  login(code) {
    return HTTP(SERVER_API.LOGIN, {
      data: {
        code: code
      }
    })
  }
}
module.exports = SERVER