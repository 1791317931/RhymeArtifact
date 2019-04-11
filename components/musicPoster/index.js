Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posterUrl: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closePoster() {
      this.triggerEvent('closePoster');
    },
    previewImage() {
      wx.previewImage({
        urls: [this.data.posterUrl]
      });
    }
  }
})
