import PosterCanvasUtil from '../../assets/js/components/PosterCanvasUtil';

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
    posterUrl: null,
    type: ''
  },

  /**
   * 组件的方法列表
   */
  // type: beat music video article
  methods: {
    generatePoster(data, type) {
      PosterCanvasUtil.draw(this, data, type);
    },
    closePoster() {
      this.setData({
        posterUrl: null
      });
    },
    previewImage() {
      wx.previewImage({
        urls: [this.data.posterUrl]
      });
    }
  }
})
