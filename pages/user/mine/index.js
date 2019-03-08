Page({

  /**
   * 页面的初始数据
   */
  data: {
    menus: [
      {
        path: '/pages/user/music/index',
        text: '音乐创作'
      },
      {
        path: '/pages/create/createLyricsList/index',
        text: '歌词创作'
      },
      {
        path: '',
        text: '收货地址',
        show: false
      },
      {
        path: '',
        text: '混音编曲',
        show: false
      },
      {
        path: '/pages/user/collection/index',
        text: '我的收藏'
      }
    ],
    extrals: [
      // {
      //   path: '',
      //   text: '关注公众号'
      // },
      {
        path: '',
        text: '商务合作'
      }
    ],
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
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
  clickMenu(e) {
    let index = e.target.dataset.index,
    url = this.data.menus[index].path;

    wx.navigateTo({
      url
    });
  },
  clickExtralMenu(e) {
    let index = e.target.dataset.index
    wx.makePhoneCall({
      phoneNumber: '17301257015' // 仅为示例，并非真实的电话号码
    })
  }
})