import CommonUtil from '../../../assets/js/CommonUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    beatComponent: null,
    // 需要跳转的页面
    targetPath: null,
    posterUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'music') {
      wx.navigateTo({
        url: '/pages/create/createMusicList/index'
      });
    }

    let beatComponent = this.selectComponent('#beatComponent');
    this.setData({
      beatComponent
    });
    beatComponent.init(this);
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
    let beatComponent = this.data.beatComponent;
    if (!beatComponent.data.beatPage.list.length) {
      beatComponent.init(this);
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
    this.data.beatComponent.getBeatPage(1, this);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.beatComponent.onReachBottom(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from == 'menu') {
      return CommonUtil.shareApp(e);
    } else if (e.from == 'button') {
      return this.data.beatComponent.shareBeatItem(e, this);
    }
  },
  toCreateMusicList() {
    this.data.beatComponent.pausePlay(null);

    wx.navigateTo({
      url: '/pages/create/createMusicList/index'
    });
  },
  toCreateLyricsList() {
    this.data.beatComponent.pausePlay(null);

    wx.navigateTo({
      url: '/pages/create/createLyricsList/index'
    });
  },
  closePoster() {
    this.setData({
      posterUrl: null
    });
  }
})