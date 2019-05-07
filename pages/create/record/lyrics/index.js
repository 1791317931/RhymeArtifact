import CommonUtil from '../../../../assets/js/CommonUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    lyricsRule: {
      content: {
        length: 1000
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      content: options.content
    });
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
    if (e.from == 'menu') {
      return CommonUtil.share(e);
    }
  },
  changeContent(e) {
    this.setData({
      content: e.detail.value.trim()
    });
  },
  saveLyrics() {
    setTimeout(() => {
      let pages = getCurrentPages(),
      prevPage = pages[pages.length - 2];
      prevPage.setData({
        'recordForm.lyrics': this.data.content
      });
      
      wx.navigateBack({

      });
    });
  }
})