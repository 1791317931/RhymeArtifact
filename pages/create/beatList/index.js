import BeatListUtil from '../../../assets/js/components/BeatListUtil';
import CommonUtil from '../../../assets/js/CommonUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    beatPage: CommonUtil.copyObject(BeatListUtil.beatPage)
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
    BeatListUtil.onReachBottom(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  init() {
    BeatListUtil.getBeatPage(1, this);
  },
  toggleBeatItemStatus(e) {
    BeatListUtil.toggleBeatItemStatus(e, this);
  },
  clickCollectionItem(e) {
    BeatListUtil.clickCollectionItem(e, this);
  },
  toRecord(e) {
    BeatListUtil.toRecord(e);
  }
})