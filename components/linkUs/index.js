Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    showShare: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    copy() {
      wx.setClipboardData({
        data: 'yayunrap',
        success: () => {
          this.setData({
            showShare: true
          })
        }
      })
    },
    toggleModal(show) {
      this.setData({
        show
      })
    },
    close() {
      this.setData({
        showShare: false
      })
      this.toggleModal(false)
    },
    prevent() {}
  }
})