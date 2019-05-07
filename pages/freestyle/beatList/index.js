import CommonUtil from '../../../assets/js/CommonUtil';
import TipUtil from '../../../assets/js/TipUtil';
import * as api from '../../../assets/js/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    activeIndex: 0,
    beatComponent: null,
    // 需要跳转的页面
    targetPath: null,
    posterUrl: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let beatComponent = this.selectComponent('#beatComponent');
    this.setData({
      beatComponent
    });
    beatComponent.isFreeStyle(true);
    beatComponent.init(this);

    this.getBeatCategory();
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
    this.data.beatComponent.pausePlay();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.beatComponent.onUnload();
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
  toggleTab(e) {
    let index = e.target.dataset.index;
    if (index != this.data.activeIndex) {
      this.setData({
        activeIndex: index
      });

      // 设置分类 id
      this.data.beatComponent.setData({
        categoryId: this.data.tabs[this.data.activeIndex].id
      });
      this.getPage(1);
    }
  },
  getBeatCategory() {
    api.getBeatCategoryList(null, (res) => {
      this.setData({
        tabs: res.data
      });

      // if (!res.data.length) {
      //   TipUtil.message('暂无分类');
      //   return;
      // }

      // // 设置分类
      // this.data.beatComponent.setData({
      //   categoryId: this.data.tabs[this.data.activeIndex].id
      // });
      this.getPage(1);
    });
  },
  getPage(pageNum = 1) {
    this.data.beatComponent.getPage(pageNum);
  }
})