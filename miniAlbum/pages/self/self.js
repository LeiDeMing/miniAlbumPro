// pages/self/self.js
import connect from '../../utils/connect.js'
import SERVER from '../../server/index.js'
const mapStateToProps = (state => {
  return {
    userInfo: state.userInfo
  }
})

Page(connect(mapStateToProps)({
  getUserInfoHandle: function(e) {
    let userInfo = e.detail.userInfo;
    if (userInfo) {
      const {
        avatarUrl: avatar,
        nickName: name
      } = userInfo
      wx.showLoading({
        title: 'loading...',
        mask: true
      })
      SERVER.updateUserInfo({
        avatar,
        name
      }).catch(e => {
        wx.hideLoading()
        console.log(e)
      }).then(() => {
        getApp().getUserInfo()
      })
    } else {
      wx.showToast({
        title: '请允许miniAlbum申请的微信授权操作',
        icon: 'none',
        mask: true,
        duration: 3000
      })
    }
  },
  scanQrcodeHandle: function(e) {
    wx.scanCode({
      onlyFromCamera: true
    }).then(res => {
      SERVER.scanCode(res.result).then(e => {
        wx.showToast({ title: '扫码登录成功', icon: 'success', duration: 2000 })
      }).catch(e => {
        wx.showToast({ title: '二维码过期，请单击二维码刷新后重试', icon: 'none', mask: true, duration: 2000 })
      })
    })
  }
}))