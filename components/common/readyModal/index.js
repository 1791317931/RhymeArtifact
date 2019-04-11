Component({
  /**
   * 组件的属性列表
   */
  properties: {
    totalCount: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    defaultCount: 3,
    count: 3,
    showModal: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show(callback) {
      let data = this.data,
      totalCount = data.totalCount,
      count = data.defaultCount;

      if (!isNaN(totalCount) && totalCount > 0) {
        count = totalCount;
      }
      this.setData({
        count,
        showModal: true
      });

      let decrease = () => {
        setTimeout(() => {
          count--;
          if (count > 0) {
            this.setData({
              count
            });
            decrease();
          } else {
            this.setData({
              showModal: false
            });
            callback();
          }
        }, 1000);
      }

      decrease();
    }
  }
})
