import TipUtil from '../../../assets/js/TipUtil';
import CommonUtil from '../../../assets/js/CommonUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import PathUtil from '../../../assets/js/PathUtil';
import TimeUtil from '../../../assets/js/TimeUtil';
import PosterCanvasUtil from '../../../assets/js/components/PosterCanvasUtil';
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    freestyleListComponent: null,
    fs: {
      title: '冠军',
      duration: 180000
    },
    posterUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let freestyleListComponent = this.selectComponent('#freestyleListComponent');

    this.setData({
      freestyleListComponent
    });
    freestyleListComponent.init(this);
    freestyleListComponent.getPage(1);
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
    this.data.freestyleListComponent.onReachBottom();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  follow() {

  },
  cancelFollow() {

  },
  pick() {

  },
  generatePoster() {
    PosterCanvasUtil.draw(this, this.data.fs, 'freestyle');
  },
  closePoster() {
    this.setData({
      posterUrl: null
    });
  }
})