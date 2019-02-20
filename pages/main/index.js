Page({

  /**
   * 页面的初始数据
   */
  data: {
    rhymeList: [
      {
        id: 1,
        text: '我今天'
      },
      {
        id: 2,
        text: '的心情'
      },
      {
        id: 3,
        text: '很不错'
      },
      {
        id: 4,
        text: '我今天'
      },
      {
        id: 5,
        text: '的心情'
      },
      {
        id: 6,
        text: '很不错'
      },
      {
        id: 7,
        text: '我今天'
      },
      {
        id: 8,
        text: '的心情'
      },
      {
        id: 9,
        text: '很不错'
      },
      {
        id: 10,
        text: '我今天'
      },
      {
        id: 11,
        text: '的心情'
      },
      {
        id: 12,
        text: '很不错'
      }
    ]
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
  onShareAppMessage: function () {

  }
})