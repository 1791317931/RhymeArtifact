// components/createMusicList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    createMusicPage: Object
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
    toggleMusicCollectItem(e) {
      this.triggerEvent('toggleMusicCollectItem', e)
    },
    toggleMusicItemStatus(e) {
      this.triggerEvent('toggleMusicItemStatus', e)
    },
    musicPlayEnd(e) {
      this.triggerEvent('musicPlayEnd', e)
    },
    musicLoadError(e) {
      this.triggerEvent('musicLoadError', e)
    },
    musicAudioTimeUpdate(e) {
      this.triggerEvent('musicAudioTimeUpdate', e)
    }
  }
})
