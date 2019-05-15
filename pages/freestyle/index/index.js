import CommonUtil from '../../../assets/js/CommonUtil';
import PathUtil from '../../../assets/js/PathUtil';
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModalComponent: null,
    user: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent');

    this.setData({
      loadModalComponent
    });

    if (options.scene) {
      let id = null,
      userId = null;
      decodeURIComponent(options.scene).split('&').forEach((item, index) => {
        let arr = item.split('=');
        if (arr[0] == 'id') {
          id = arr[1];
        }

        if (arr[0] == 'userId') {
          userId = arr[1];
        }
      });

      wx.navigateTo({
        url: `/pages/freestyle/play/index?id=${id}&userId=${userId}`,
      });
    } else {
      let id = options.id;
      let userId = options.userId;

      if (id && userId) {
        wx.navigateTo({
          url: `/pages/freestyle/play/index?id=${id}&userId=${userId}`,
        });
      }
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
    this.getUserInfo();
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
  toggleLoadingUserInfo(loading) {
    this.data.loadModalComponent.setData({
      loading
    });
  },
  getUserInfo() {
    this.toggleLoadingUserInfo(true);

    api.getMyInfo({
      have: 'freestyle_count, music_count'
    }, (res) => {
      let user = res.data;
      user.avatarUrl = PathUtil.getFilePath(user.avatar);

      this.setData({
        user
      });
    }, () => {
      this.toggleLoadingUserInfo(false);
    });
  },
  toRankList() {
    wx.navigateTo({
      url: '/pages/freestyle/rankList/index'
    });
  },
  toBeatList() {
    wx.navigateTo({
      url: '/pages/freestyle/record/index'
    });
  },
  toH5() {
    wx.navigateTo({
      url: '/pages/webview/index?path=https://admin.miyupp.com/activity/2019-04-17/voice-rank.html'
    });
  }
})