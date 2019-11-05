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
    showUserInfo: true,
    showMobile: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeModal() {
      this.setData({
        showUserInfo: false,
        showMobile: false
      })
    },
    prevent() {}
  }
})
