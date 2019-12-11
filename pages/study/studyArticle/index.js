import * as api from '../../../assets/js/api';
import PathUtil from '../../../assets/js/PathUtil';
import TipUtil from '../../../assets/js/TipUtil';
import PosterCanvasUtil from '../../../assets/js/components/PosterCanvasUtil';
import WxParse from '../../../pages/wxParse/wxParse.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    article: null,
    loadModal: null,
    commentComponent: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let commentComponent = this.selectComponent('#commentComponent');
    commentComponent.init(this)
    commentComponent.setData({
      type: 'posts',
      targetId: id
    })

    this.setData({
      id,
      loadModal: this.selectComponent('#loadModal'),
      commentComponent
    });
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let article = this.data.article;
    return {
      title: article.title,
      path: '/pages/study/studyList/index?t=article&id=' + article.id
    };
  },
  init() {
    let loadModal = this.data.loadModal;

    loadModal.setData({
      loading: true
    });
    api.getArticleById({
      id: this.data.id
    }, (res) => {
      var article = `<div>${this.translateContent(res.data.content)}</div>`
      WxParse.wxParse('wxParseData', 'html', article, this, 0);
      this.setData({
        article: res.data
      });
    }, () => {
      loadModal.setData({
        loading: false
      });
    });
    this.data.commentComponent.getPage()
  },
  translateContent(content) {
    let startIndex = content.indexOf('<figure class="media">')
    let substring
    let url
    let urlStartIndex
    while(startIndex != -1) {
      substring = content.substring(startIndex, content.indexOf('</figure>', startIndex + 9) + 9)
      urlStartIndex = substring.indexOf('url="') + 5
      url = substring.substring(urlStartIndex, substring.indexOf('"', urlStartIndex))
      content = content.replace(substring, `<video src="${url}" custom-cache="false" controls autoplay></video>`)
      startIndex = content.indexOf('<figure class="media">')
    }

    return content
  },
  generatePoster(e) {
    let article = this.data.article;
    this.getPosterInfo(article, () => {
      this.data.musicPosterComponent.generatePoster(article, 'article');
    });
  },
  getPosterInfo(article, callback) {
    // 已经获取过本地图片
    if (article.temp_cover) {
      callback && callback(path);
      return;
    }

    wx.showLoading({
      title: '海报生成中...',
    });
    wx.getImageInfo({
      src: article.cover,
      success: (res) => {
        let path = res.path;
        this.setData({
          'article.temp_cover': path
        });
        callback && callback(path);
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  }
})