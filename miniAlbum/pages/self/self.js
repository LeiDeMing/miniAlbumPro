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
        avatarUrl:avatar,
        nickName: name
      } = userInfo
      wx.showLoading({
        title: 'loading...',
        mask: true
      })
      SERVER.updateUserInfo({
        avatar,
        name
      }).catch(e=>{
        wx.hideLoading()
        console.log(e)
      }).then(()=>{
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
  }
}))