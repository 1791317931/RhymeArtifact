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
    // 不显示头部信息
    this.setData({
      'createMusicPage.showHead': false,
      'createMusicPage.showMine': true
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
    wx.stopPullDownRefresh();
    wx.vibrateShort()
    CreateMusicListUtil.getMusicPage(1, this);
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
  onShareAppMessage: function (e) {
    if (e.from == 'menu') {
      return CommonUtil.shareApp(e);
    } else {
      return CreateMusicListUtil.shareItem(e, this);
    }
  },
  init() {
    CreateMusicListUtil.getMusicPage(1, this);
  },
  removeMusicItem(e) {
    CreateMusicListUtil.removeMusicItem(e && e.detail || '', this);
  },
  toggleMusicItemStatus(e) {
    CreateMusicListUtil.toggleMusicItemStatus(e && e.detail || '', this);
  },
  toggleMusicCollectItem(e) {
    CreateMusicListUtil.toggleMusicCollectItem(e && e.detail || '', this);
  },
  playEnd(e) {
    CreateMusicListUtil.playEnd(e, this);
  },
  loadError(e) {
    CreateMusicListUtil.loadError(e, this);
  },
  musicAudioTimeUpdate(e) {
    CreateMusicListUtil.musicAudioTimeUpdate(e, this);
  }
})