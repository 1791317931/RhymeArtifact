// components/createLyricsList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lyricsPage: Object
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
    clickLyricItem(e) {
      console.log(e)
      this.triggerEvent('clickLyricItem', e)
    },
    shareLyric(e) {
      this.triggerEvent('shareLyric', e)
    },
    removeLyric(e) {
      this.triggerEvent('removeLyric', e)
    }
  }
})
