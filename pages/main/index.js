import * as api from '../../assets/js/api';
import CommonUtil from '../../assets/js/CommonUtil';
import SearchLyricUtil from '../../assets/js/components/SearchLyricUtil';

Page({
  /**
   * 页面的初始数据
   */
  
  data: {
    rhymePage: CommonUtil.copyObject(SearchLyricUtil.rhymePage),
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
    return CommonUtil.shareApp(e);
  },
  changeKeyword(e) {
    SearchLyricUtil.changeKeyword(e && e.detail || '', this);
  },
  toggleMortgage(e) {
    SearchLyricUtil.toggleMortgage(e && e.detail || '', this);
  },
  getRhymeList(e) {
    SearchLyricUtil.getRhymeList(e && e.detail || '', this);
  }
})