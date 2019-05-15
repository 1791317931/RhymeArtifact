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
    loading: false,
    loadingMessage: '数据加载中...',
    scope: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setScope(scope) {
      this.setData({
        scope
      });
    },
    init(scope) {
      this.setScope(scope);
    },
    toggleLoading(loading) {
      this.setData({
        loading
      });
    },
    isLoading() {
      return this.data.loading;
    }
  }
})
