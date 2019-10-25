import CommonUtil from '../../../assets/js/CommonUtil';
import PathUtil from '../../../assets/js/PathUtil';
import * as api from '../../../assets/js/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menus: [
      {
        html: 'https://www.peaceandlovemusic.cn/#/residence',
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
    loadModalComponent: null,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent')
    this.setData({
      loadModalComponent
    })
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
    this.getUserInfo()
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
  toggleLoading(loading) {
    this.data.loadModalComponent.setData({
      loading
    })
  },
  getUserInfo() {
    this.toggleLoading(true)
    api.getUserInfoByToken((res) => {
      this.setData({
        userInfo: res.data
      });
    }, () => {
      this.toggleLoading(false)
    })
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
    let html = item.html

    if (openType == 'concat') {
      // 不用加代码
    } else if (html) {
      wx.navigateTo({
        url: `/pages/webview/index?path=${html}`,
      })
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