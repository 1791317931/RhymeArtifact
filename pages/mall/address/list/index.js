import CommonUtil from '../../../../assets/js/CommonUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressComponent: null,
    // 进入该页面时，是否可以选中某个选项
    forChoose: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let addressComponent = this.selectComponent('#addressComponent');
    this.setData({
      addressComponent
    });
    addressComponent.init(this);

    if (options.forChoose) {
      addressComponent.setData({
        forChoose: true
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
    this.data.addressComponent.getPage(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.addressComponent.onReachBottom();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return CommonUtil.share(e);
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/mall/address/edit/index'
    });
  }
})