import CommonUtil from '../../../assets/js/CommonUtil';
import PathUtil from '../../../assets/js/PathUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menus: [
      {
        path: '/pages/user/music/index',
        text: '成为音乐人'
      },
      {
        path: '/pages/user/collection/index',
        text: '我的喜欢'
      },
      {
        path: '/pages/create/createLyricsList/index',
        text: '我的歌词创作'
      },
      {
        path: '/pages/user/music/index',
        text: '我的音乐创作'
      },
      {
        path: '',
        text: '商务合作',
        openType: 'contact'
      }
    ],
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    userInfo.avatarUrl = PathUtil.getFilePath(userInfo.avatarUrl);
    this.setData({
      userInfo 
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
    return CommonUtil.share(e);
  },
  toOrderList() {
    wx.navigateTo({
      url: '/pages/user/order/index/index'
    })
  },
  toCollectionList() {
    wx.navigateTo({
      url: '/pages/zmall/beatDetail/index?type=collection'
    })
  },
  clickMenu(e) {
    let index = e.target.dataset.index
    let item = this.data.menus[index]
    let openType = item.openType
    let url = item.path

    if (openType == 'concat') {
      
    } else if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  toDetail() {
    wx.navigateTo({
      url: '/pages/user/info/index'
    })
  }
})