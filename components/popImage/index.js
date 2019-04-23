import PathUtil from '../../assets/js/PathUtil';

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
    img: null,
    wechat: '15517942602'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showImg(url) {
      this.setData({
        img: PathUtil.getFilePath(url)
      });
    },
    copy() {
      wx.setClipboardData({
        data: this.data.wechat
      });
      this.close();
    },
    close() {
      this.setData({
        img: null
      });
    }
  }
})
