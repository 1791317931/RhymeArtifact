Component({
  /**
   * 组件的属性列表
   */
  properties: {
    studyArticlePage: Object
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
    generatePoster(e) {
      this.triggerEvent('generatePoster', e);
    },
    clickStudyArticleItem(e) {
      this.triggerEvent('clickStudyArticleItem', e);
    }
  }
})
