import CommonUtil from '../../assets/js/CommonUtil';

Page({
  /**
   * 页面的初始数据
   */
  
  data: {
    lyricId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.redirectTo({
        url: '/pages/authorition/index'
      });
      return;
    }

    if (options.lyricId) {      
      this.setData({
        lyricId: options.lyricId
      });
    }
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
    if (this.data.lyricId) {
      wx.navigateTo({
        url: '/pages/create/lyrics/index?readonly=Y&id=' + this.data.lyricId
      });

      this.setData({
        lyricId: null
      });
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
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return CommonUtil.share(e);
  },
  toH5() {
    wx.navigateTo({
      url: '/pages/webview/index?path=https://admin.miyupp.com/activity/2019-04-17/voice-rank.html'
    });
  }
})