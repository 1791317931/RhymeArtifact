import CommonUtil from '../../../assets/js/CommonUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    audioComponent: null,
    musicComponent: null,
    musicPosterComponent: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicComponent = this.selectComponent('#musicComponent'),
    musicPosterComponent = this.selectComponent('#musicPosterComponent');

    musicComponent.init(this);
    this.setData({
      audioComponent: musicComponent,
      musicComponent,
      musicPosterComponent
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
    this.data.musicComponent.setStatus()
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
    this.data.musicComponent.getMusicPage(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.musicComponent.onReachBottom();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from == 'menu') {
      return CommonUtil.share(e);
    } else {
      return this.data.musicComponent.shareItem(e);
    }
  },
  init() {
    this.data.musicComponent.getPage(1);
  }
})