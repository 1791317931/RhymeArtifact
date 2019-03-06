import DateUtil from '../../../assets/js/DateUtil';
import CommonUtil from '../../../assets/js/CommonUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import TipUtil from '../../../assets/js/TipUtil';
import * as api from '../../../assets/js/api';
import CreateMusicListUtil from '../../../assets/js/components/CreateMusicListUtil';
import BeatListUtil from '../../../assets/js/components/BeatListUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    beatPage: CommonUtil.copyObject(BeatListUtil.beatPage),
    createMusicPage: CommonUtil.copyObject(CreateMusicListUtil.createMusicPage),
    BAC: null,
    MAC: null,
    // music beat
    type: 'music'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'createMusicPage.showHead': false,
      'createMusicPage.showMine': true,
      'beatPage.showMine': true
    });
    CreateMusicListUtil.init(this);
    BeatListUtil.init(this);
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
    let type = this.data.type;
    if (type == 'music') {
      CreateMusicListUtil.onReachBottom(this);
    } else if (type == 'beat') {
      BeatListUtil.onReachBottom(this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let type = this.data.type;
    if (type == 'music') {
      return CreateMusicListUtil.shareItem(e, this);
    }
  },
  init() {
    let type = this.data.type;
    if (type == 'music') {
      CreateMusicListUtil.getMusicPage(1, this);
    } else if (type == 'beat') {
      BeatListUtil.getBeatPage(1, this);
    }
  },
  togglePage(e) {
    let type = this.data.type;
    if (type != e.target.dataset.value) {
      if (type == 'music') {
        type = 'beat';
      } else if (type == 'beat') {
        type = 'music';
      }

      this.setData({
        type
      });
    }

    CreateMusicListUtil.pausePlay(e, this);
    BeatListUtil.pausePlay(e, this);
    this.init();
  },
  toggleMusicItemStatus(e) {
    CreateMusicListUtil.toggleMusicItemStatus(e, this);
  },
  toggleMusicCollectItem(e) {
    CreateMusicListUtil.toggleMusicCollectItem(e, this);
  },
  musicPlayEnd(e) {
    CreateMusicListUtil.musicPlayEnd(e, this);
  },
  musicLoadError(e) {
    CreateMusicListUtil.musicLoadError(e, this);
  },
  toggleBeatItemStatus(e) {
    BeatListUtil.toggleBeatItemStatus(e, this);
  },
  toggleBeatCollectionItem(e) {
    BeatListUtil.toggleBeatCollectionItem(e, this);
  },
  toRecord(e) {
    BeatListUtil.toRecord(e, this);
  },
  beatPlayEnd(e) {
    BeatListUtil.beatPlayEnd(e, this);
  },
  beatLoadError(e) {
    BeatListUtil.beatLoadError(e, this);
  }
})