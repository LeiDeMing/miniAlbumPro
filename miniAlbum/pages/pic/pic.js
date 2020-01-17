// pages/pic/pic.js
import SERVER from "../../server/index"
import {
  formatTime
} from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '相册',
    fm: SERVER.FM,
    pics: [],
    nums: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      id,
      name
    } = options
    this.setData({
      id,
      name
    })
    wx.setNavigationBarTitle({
      title: name,
    })
    this.getPic()
  },
  getPic() {
    console.log(111)
    SERVER.getPic(this.data.id).then(res => {
      const {
        status,
        data
      } = res.data
      if (status === 0) {
        let pics = count ? this.reSort(data) : []
        this.setData({
          pics,
          nums: count
        })
      }
    })
  },
  reSort(d) {
    let result = []
    let flag = null
    d.forEach(e => {
      let eT = formatTime(new Date(e.created))
      e.created = eT
      let _index = result.length
      if (et !== flag) {
        flag = eT
      } else {
        _index -= 1
      }
      result[_index] = result[_index] || []
      result[_index].push(e)
    })
    this.setData({
      fm: result[0][0].url
    })
    return result
  },
  upload(evt) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera']
    }).then(res => {
      wx.showLoading({
        title: '上传中...',
        mask: true
      })
      SERVER.addPic({
        filePath: res.tempFilePaths[0],
        name: 'file',
        formData: {
          id: this.data.id
        }
      }).then(res => {

      }).catch(e => {
        wx.hideLoading()
        console.log(e)
      })
    })
  }
})