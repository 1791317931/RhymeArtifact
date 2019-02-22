import DateUtil from '../../../assets/js/DateUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    lyricsPage: {
      list: [
        {
          id: 1,
          createTime: 1550820563116,
          title: '《他，我会更好》'
        },
        {
          id: 2,
          createTime: 1550820563116,
          title: '《心中一个你》'
        }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = this.data.lyricsPage.list;
    list.forEach((item, index) => {
      item.createTime = DateUtil.getFormatTime(new Date(item.createTime));
    });
    this.setData({
      'lyricsPage.list': list
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
  onShareAppMessage: function () {

  },
  toAddLyrics() {
    wx.navigateTo({
      url: '/pages/create/lyrics/index'
    });
  }
})