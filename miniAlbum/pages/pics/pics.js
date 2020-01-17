// pages/pics/pics.js
import SERVER from '../../server/index.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    hidden: true,
    fm: SERVER.FM
  },
  onShow() {
    this.getPics()
  },
  getPics() {
    wx.showLoading({
      title: 'loading...',
      mask: true
    })
    SERVER.getPics().then(res => {
      const {
        data,
        status
      } = res.data
      this.setData({
        pics: data
      })
    }).catch(e => {
      console.log(e)
    }).finally(() => {
      wx.hideLoading()
    })
  },
  create() {
    this.setData({
      hidden: false
    })
  },
  onAddPics(e) {
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    SERVER.addPics(e.detail.name).then(res => {
      const {
        status
      } = res.data
      if (status === 0) this.getPics()
    }).finally(() => {
      wx.hideLoading()
      this.setData({
        hidden: true
      })
    })
  },
  onGoBack() {
    wx.hideLoading()
    this.setData({
      hidden: true
    })
  },
  toDetail(evt) {
    let {
      id,
      name
    } = evt.currentTarget.dataset
    wx.navigateTo({
      url: `../pic/pic?id=${id}&name=${name}`,
    })
  }
})