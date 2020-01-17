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
    SERVER.getPic(this.data.id).then(res => {
      
    })
  }
})