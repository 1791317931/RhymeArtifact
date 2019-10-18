Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    activeId: -1,
    tabWidth: 10000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategoryList()
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
    wx.stopPullDownRefresh();
    wx.vibrateShort()
    this.getPage(1);
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
  setTabWidth() {
    let query = wx.createSelectorQuery().in(this),
    that = this;
    query.selectAll('.tab-item').boundingClientRect(function (rectList) {
      let tabWidth = 0;
      for (let i = 0; i < rectList.length; i++) {
        console.log(rectList[i])
        tabWidth += Math.ceil(rectList[i].width);
      }

      that.setData({
        tabWidth
      });
    }).exec();
  },
  getCategoryList() {
    setTimeout(() => {
      this.setData({
        tabs: [
          {
            id: -1,
            name: '全部'
          },
          {
            id: 1,
            name: '最新福建省1 gdfgdgdgd'
          },
          {
            id: 2,
            name: '最新福建省2'
          },
          {
            id: 3,
            name: '最新福建省3'
          },
          {
            id: 4,
            name: '最新福建省4'
          },
          {
            id: 5,
            name: '最新福建省5'
          }
        ]
      })

      this.setTabWidth()
    }, 500)
  },
  getPage(pageNum = 1) {

  },
  toggleAll() {

  },
  toggleTab(e) {

  }
})