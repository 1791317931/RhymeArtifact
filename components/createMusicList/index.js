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
    removeMusicItem(e) {
      wx.showModal({
        title: '系统提示',
        content: '是否删除当前音乐作品？',
        success: (res) => {
          if (res.confirm) {
            this.triggerEvent('removeMusicItem', e)
          }
        }
      });
    },
    toggleMusicCollectItem(e) {
      this.triggerEvent('toggleMusicCollectItem', e)
    },
    toggleMusicItemStatus(e) {
      this.triggerEvent('toggleMusicItemStatus', e)
    },
    generatePoster(e) {
      this.triggerEvent('generatePoster', e);
    }
  },
})
