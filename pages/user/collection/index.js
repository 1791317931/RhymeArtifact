import CommonUtil from '../../../assets/js/CommonUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // music beat
    type: 'music',
    posterUrl: null,
    beatComponent: null,
    musicComponent: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let beatComponent = this.selectComponent('#beatComponent'),
    musicComponent = this.selectComponent('#musicComponent');

    beatComponent.setData({
      'page.showCollection': true
    });
    musicComponent.setData({
      'page.showCollection': true
    });
    this.setData({
      beatComponent,
      musicComponent
    });

    musicComponent.init(this);
    beatComponent.init(this);
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
    this.data.beatComponent.pausePlay();
    this.data.musicComponent.pausePlay();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.beatComponent.onUnload();
    this.data.musicComponent.onUnload();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();

    let type = this.data.type;
    if (type == 'music') {
      this.data.musicComponent.getPage(1);
    } else if (type == 'beat') {
      this.data.beatComponent.getPage(1);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let type = this.data.type;
    if (type == 'music') {
      this.data.musicComponent.onReachBottom();
    } else if (type == 'beat') {
      this.data.beatComponent.onReachBottom();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from == 'menu') {
      return CommonUtil.shareApp(e);
    } else {
      let type = this.data.type;
      if (type == 'music') {
        return this.data.musicComponent.shareItem(e);
      } else if (type == 'beat') {
        return this.data.beatComponent.shareItem(e);
      }
    }
  },
  init() {
    let type = this.data.type;
    if (type == 'music') {
      this.data.musicComponent.getPage(1);
    } else if (type == 'beat') {
      this.data.beatComponent.getPage(1);
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

    this.data.musicComponent.pausePlay(e);
    this.data.beatComponent.pausePlay(e);
    this.init();
  },
  closePoster() {
    this.setData({
      posterUrl: null
    });
  }
})