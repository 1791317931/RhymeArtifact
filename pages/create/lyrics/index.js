import CommonUtil from '../../../assets/js/CommonUtil';
import SearchLyricUtil from '../../../assets/js/templates/SearchLyricUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lyricsForm: {
      title: '',
      content: '当我加强了我的脚步来到的2019年 Twenty-three的年纪 掌控这未来的主导权 回顾22年的经历 陪伴 微笑的味道 所有 错过的 爱过的 痛过的 恨过的 全新记号 16岁时出来混从来不需要家里罩 曾经住过的那间地下室 变成时空的隧道 如果能带我穿梭过去 在掩饰所有谎言 新理论的起点 在这骄傲的年纪 开启这新一轮赛点 新一轮的计划 不需要谁来评选 看清楚选择脚下走的路 让自己飞的更远 过去的时光消逝无影踪 笃定梦想可以占据我领空'
    },
    lyricsRule: {
      title: {
        length: 30
      },
      content: {
        length: 1000
      }
    },
    // create创建   search搜索
    mode: 'create',
    rhymePage: CommonUtil.copyObject(SearchLyricUtil.rhymePage)
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
  saveLyrics() {
    wx.navigateBack({
      
    });
  },
  changeTitle(e) {
    let title = e.detail.value;
    this.setData({
      'lyricsForm.title': title
    });
  },
  changeKeyword(e) {
    SearchLyricUtil.changeKeyword(e, this);
  },
  toggleMortgage(e) {
    SearchLyricUtil.toggleMortgage(e, this);
  },
  getRhymeList() {
    SearchLyricUtil.getRhymeList(this);
  }
})