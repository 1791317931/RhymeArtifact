import DateUtil from '../../../assets/js/DateUtil';
import CommonUtil from '../../../assets/js/CommonUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import TipUtil from '../../../assets/js/TipUtil';
import * as api from '../../../assets/js/api';
import LyricListUtil from '../../../assets/js/components/LyricListUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    lyricsPage: CommonUtil.copyObject(LyricListUtil.lyricsPage)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    LyricListUtil.onReachBottom(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    LyricListUtil.shareLyric(e, this);
  },
  init() {
    LyricListUtil.getLyricPage(1, this);
  },
  toAddLyrics() {
    wx.navigateTo({
      url: '/pages/create/lyrics/index'
    });
  },
  clickLyricItem(e) {
    LyricListUtil.clickLyricItem(e, this);
  },
  shareLyric(e) {
    
  },
  toDeleteLyricItem(e) {
    LyricListUtil.toDeleteLyricItem(e, this);
  }
})