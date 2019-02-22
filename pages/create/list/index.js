Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicPage: {
      showHead: true,
      list: [
        {
          id: 1,
          createBy: '陈梓童',
          title: '梦的远方',
          author: '今晚吃鱼丸',
          composer: '金光旭'
        },
        {
          id: 2,
          createBy: '陈梓童',
          title: '当你走的45天',
          author: 'Yinu Boy',
          composer: '金光旭'
        }
      ]
    }
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

  },
  toCreateMusic() {
    wx.navigateTo({
      url: '/pages/create/createMusicList/index'
    });
  }
})