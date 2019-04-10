import CommonUtil from '../../../assets/js/CommonUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        flag: 'tarp',
        text: 'Tarp'
      },
      {
        flag: 'old school',
        text: 'old school'
      }
    ],
    activeIndex: 0,
    beatComponent: null,
    // 需要跳转的页面
    targetPath: null,
    posterUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let beatComponent = this.selectComponent('#beatComponent');
    this.setData({
      beatComponent
    });
    beatComponent.isFreeStyle(true);
    beatComponent.init(this);
    this.getPage(1);
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
    if (!this.data.beatComponent.data.page.list.length) {
      this.getPage(1);
    }

    if (this.data.targetPath) {
      wx.navigateTo({
        url: this.data.targetPath
      });
      this.setData({
        targetPath: null
      });
      return;
    }
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
    this.data.beatComponent.onReachBottom();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return CommonUtil.shareApp(e);
  },
  toggleTab(e) {
    let index = e.target.dataset.index;
    if (index != this.data.activeIndex) {
      this.setData({
        activeIndex: index
      });
      this.getPage(1);
    }
  },
  getPage(pageNum = 1) {
    let data = this.data,
    flag = data.tabs[data.activeIndex].flag,
    beatComponent = data.beatComponent;








    // 需要设置参数
    if (flag === 'tarp') {
      beatComponent.getPage(1);
    } else if (flag === 'old school') {
      beatComponent.getPage(1);
    }
  },
  closePoster() {
    this.setData({
      posterUrl: null
    });
  }
})