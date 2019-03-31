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
    posterUrl: null,
    loadModal: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      loadModal: this.selectComponent('#loadModal')
    });
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
    this.init();
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
      path: '/pages/study/studyList/index?t=article&id=' + article.id,
      success: (res) => {

      },
      fail(res) {

      },
      complete(res) {

      }
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
      var article = `<div>${res.data.content}</div>`
      WxParse.wxParse('wxParseData', 'html', article, this, 0);
      this.setData({
        article: res.data
      });
    }, () => {
      loadModal.setData({
        loading: false
      });
    });
  },
  generatePoster(e) {
    PosterCanvasUtil.draw(this, this.data.article, 'article');
  },
  closePoster() {
    this.setData({
      posterUrl: null
    });
  }
})