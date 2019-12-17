import CommonUtil from '../../../assets/js/CommonUtil';
import TipUtil from '../../../assets/js/TipUtil';
import * as api from '../../../assets/js/api'
import BAC from '../../../assets/js/components/backgroundAudio/BAC'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    audioComponent: null,
    beatComponent: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let beatComponent = this.selectComponent('#beatComponent');
    this.setData({
      audioComponent: beatComponent,
      beatComponent
    })
    beatComponent.setData({
      'page.isFreeStyle': true
    })
    beatComponent.init(this)
    beatComponent.getCategoryList()
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
    // 只要触发hide，就默认为自动播放，避免tab之间切换，出现bug
    this.data.beatComponent.setData({
      autoPlay: true
    })
    BAC.autoPlay = true
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
    this.getPage(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.beatComponent.onReachBottom();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return CommonUtil.share(e);
  },
  getPage(pageNum = 1) {
    this.data.beatComponent.getPage(pageNum);
  }
})