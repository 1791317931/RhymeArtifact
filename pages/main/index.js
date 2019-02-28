import * as api from '../../assets/js/api';
import ConfigUtil from '../../assets/js/ConfigUtil';
import TipUtil from '../../assets/js/TipUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    rhymePage: {
      loading: false,
      list: []
    },
    mortgageButtons: [
      {
        value: 'single',
        text: '单押'
      },
      {
        value: 'double',
        text: '双押'
      },
      {
        value: 'three',
        text: '三押'
      }
    ],
    keyword: '',
    // 押韵规则
    mortgage: 'single'
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

    this.getRhymeList();
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
  changeKeyword(e) {
    this.setData({
      keyword: e.detail.value
    });
  },
  toggleMortgage(e) {
    let value = e.currentTarget.dataset.value;

    if (value != this.data.mortgage) {
      this.setData({
        mortgage: value
      });
      this.getRhymeList();
    }
  },
  toggleRhymeLoading(loading) {
    this.setData({
      'rhymePage.loading': loading
    });
  },
  getRhymeList() {
    let data = this.data;

    this.toggleRhymeLoading(true);
    api.getRhymeList({
      kwd: data.keyword,
      mortgage: data.mortgage
    }, (res) => {
      if (ConfigUtil.isSuccess(res.code)) {
        this.setData({
          'rhymePage.list': res.data
        });
      } else {
        TipUtil.errorCode(res.code);
      }
    }, () => {
      this.toggleRhymeLoading(false);
    });
  }
})