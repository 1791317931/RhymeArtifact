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
    posterUrl: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    generatePoster(data) {
      PosterCanvasUtil.draw(this, data, 'freestyle');
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
