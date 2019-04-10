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
    if (options.scene) {
      decodeURIComponent(options.scene).split('&').forEach((item, index) => {
        let arr = item.split('=');
        if (arr[0] == 'type') {
          if (arr[1] == 'music') {
            wx.navigateTo({
              url: '/pages/create/createMusicList/index'
            });
          }
        }
      });
    } else if (options.type == 'music') {
      wx.navigateTo({
        url: '/pages/create/createMusicList/index'
      });
    }

    let beatComponent = this.selectComponent('#beatComponent');
    this.setData({
      beatComponent
    });
    beatComponent.init(this);
    beatComponent.getPage();
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

    // token过期后重新登陆或者删除收藏，都需要刷新页面，否则再次操作收藏会出异常
    let beatComponent = this.data.beatComponent;
    beatComponent.init(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.data.beatComponent.pausePlay();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.beatComponent.onUnload();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.data.beatComponent.getPage(1);
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
      return this.data.beatComponent.shareItem(e, this);
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