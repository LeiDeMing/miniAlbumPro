// components/create/create.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    picName: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    eventInput(e) {
      this.setData({
        picName: e.detail.value
      })
    },
    create(e) {
      const name = (this.data.picName || '').trim()
      if (name == '') return
      this.triggerEvent('addPics', {
        name
      })
    },
    goBack(){
      this.triggerEvent('goBack')
    }
  }
})