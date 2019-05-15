import DownloadUtil from '../../../assets/js/DownloadUtil';
import * as api from '../../../assets/js/api';
import PathUtil from '../../../assets/js/PathUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrCode: null,
    loadModalComponent: null,
    tempQrCode: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent');
    loadModalComponent.init(this);
    this.setData({
      loadModalComponent
    });

    this.getRapQrcode();
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
  getRapQrcode() {
    let loadModalComponent = this.data.loadModalComponent;

    loadModalComponent.toggleLoading(true);
    api.getRapQrcode((res) => {
      this.setData({
        qrCode: res.data.url
      });
    }, () => {
      loadModalComponent.toggleLoading(false);
    });
  },
  save() {
    DownloadUtil.authorize(this.data.qrCode);
  },
  previewImage() {
    // 必须是网络图片
    wx.previewImage({
      urls: [this.data.qrCode]
    });
  }
})