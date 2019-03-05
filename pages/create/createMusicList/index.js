import DateUtil from '../../../assets/js/DateUtil';
import CommonUtil from '../../../assets/js/CommonUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import TipUtil from '../../../assets/js/TipUtil';
import * as api from '../../../assets/js/api';
import CreateMusicListUtil from '../../../assets/js/components/CreateMusicListUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    createMusicPage: CommonUtil.copyObject(CreateMusicListUtil.createMusicPage),
    // 试听音频
    TAC: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    CreateMusicListUtil.init(this);
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
    CreateMusicListUtil.onReachBottom(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  init() {
    CreateMusicListUtil.getMusicPage(1, this);
  },
  toCreateMusicList() {
    wx.navigateTo({
      url: '/pages/create/createMusicList/index'
    });
  },
  toCreateLyricsList() {
    wx.navigateTo({
      url: '/pages/create/createLyricsList/index'
    });
  },
  toggleMusicItemStatus(e) {
    CreateMusicListUtil.toggleMusicItemStatus(e, this);
  },
  collectItem(e) {
    CreateMusicListUtil.collectItem(e, this);
  }
})