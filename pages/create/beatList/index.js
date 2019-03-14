import BeatListUtil from '../../../assets/js/components/BeatListUtil';
import CommonUtil from '../../../assets/js/CommonUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    beatPage: CommonUtil.copyObject(BeatListUtil.beatPage),
    BAC: null,
    // 需要跳转的页面
    targetPath: null,
    posterId: 'poster-canvas'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    BeatListUtil.init(this);
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
    if (this.data.targetPath) {
      wx.navigateTo({
        url: this.data.targetPath
      });
      this.setData({
        targetPath: null
      });
      return;
    }

    // 如果token过期，进入该页面，默认会先进入登录页面成功后切换到这个页面不会重新执行onLoad事件，造成假数据
    if (!this.data.beatPage.list.length) {
      this.init();
    }
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
    BeatListUtil.getBeatPage(1, this);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    BeatListUtil.onReachBottom(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from == 'menu') {
      return CommonUtil.shareApp(e);
    }
  },
  init() {
    BeatListUtil.getBeatPage(1, this);
  },
  toCreateMusicList() {
    BeatListUtil.pausePlay(null, this);

    wx.navigateTo({
      url: '/pages/create/createMusicList/index'
    });
  },
  toCreateLyricsList() {
    BeatListUtil.pausePlay(null, this);

    wx.navigateTo({
      url: '/pages/create/createLyricsList/index'
    });
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
  },
  beatAudioTimeUpdate(e) {
    BeatListUtil.beatAudioTimeUpdate(e, this);
  }
})