Component({
  /**
   * 组件的属性列表
   */
  properties: {
    beatPage: Object
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
    toggleBeatCollectionItem(e) {
      this.triggerEvent('toggleBeatCollectionItem', e);
    },
    toggleBeatItemStatus(e) {
      this.triggerEvent('toggleBeatItemStatus', e);
    },
    toRecord(e) {
      this.triggerEvent('toRecord', e);
    },
    generatePoster(e) {
      this.triggerEvent('generatePoster', e);
    }
  }
})
