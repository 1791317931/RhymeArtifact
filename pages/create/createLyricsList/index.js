import DateUtil from '../../../assets/js/DateUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import TipUtil from '../../../assets/js/TipUtil';
import * as api from '../../../assets/js/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    lyricsPage: {
      loading: false,
      page: 1,
      pageSize: 10,
      list: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let list = this.data.lyricsPage.list;
    // list.forEach((item, index) => {
    //   item.createTime = DateUtil.getFormatTime(new Date(item.createTime));
    // });
    // this.setData({
    //   'lyricsPage.list': list
    // });
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
    this.init();
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
    let page = this.data.lyricsPage;
    this.getLyricPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  init() {
    this.getLyricPage();
  },
  toAddLyrics() {
    wx.navigateTo({
      url: '/pages/create/lyrics/index'
    });
  },
  toggleLyricPageLoading(loading) {
    this.setData({
      'lyricsPage.loading': loading
    });
  },
  getLyricPage(pageNum = 1) {
    let page = this.data.lyricsPage;
    if (page.loading) {
      return;
    }

    let param = {
      page: pageNum,
      pageSize: page.pageSize
    };
    this.toggleLyricPageLoading(true);
    this.setData({
      'lyricsPage.page': pageNum
    });

    api.getLyricPage(param, (res) => {
      if (ConfigUtil.isSuccess(res.code)) {
        this.setData({
          'lyricsPage.list': res.data,
          // 'lyricsPage.maxPage': res
        });
      } else {
        TipUtil.errorCode(res.code);
      }
    }, () => {
      this.toggleLyricPageLoading(false);
    });
  }
})