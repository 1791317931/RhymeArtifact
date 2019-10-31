import * as api from '../../assets/js/api';
import ConfigUtil from '../../assets/js/ConfigUtil';
import CommonUtil from '../../assets/js/CommonUtil';
import TipUtil from '../../assets/js/TipUtil';
import UrlUtil from '../../assets/js/UrlUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shouldBindPhone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    UrlUtil.isLogin = true
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
    UrlUtil.isLogin = false;
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
    return CommonUtil.share();
  },
  bindGetUserInfo(e) {
    // 1、先在微信服务器登录
    wx.login({
      success: (res) => {
        let code = res.code;
        // 2、调用getuserinfo接口拿到encryptedData，iv,然后给服务端
        wx.getUserInfo({
          lang: 'zh_CN',
          success: (res) => {
            let encryptedData = res.encryptedData,
            iv = res.iv,
            userInfo = res.userInfo;

            let obj = {};
            obj.code = code;
            obj.encryptData = encryptedData;
            obj.iv = iv;

            api.login(obj, (res) => {
              wx.setStorageSync('token', res.data.token);
              wx.setStorageSync('userInfo', res.data.userInfo);

              if (res.data.userInfo.mobile) {
                wx.switchTab({
                  url: '/pages/zmall/index/index'
                });
              } else {
                TipUtil.message('请绑定手机号')
                this.setData({
                  shouldBindPhone: true
                })
              }
            });
          }
        });
      }
    });
  },
  bindGetPhone(e) {
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv

    // 1、先在微信服务器登录
    wx.login({
      success: (res) => {
        let code = res.code;
        let userInfo = wx.getStorageSync('userInfo');
        let obj = {
          open_id: userInfo.open_id
        };
        obj.code = code;
        obj.encryptData = encryptedData;
        obj.iv = iv;

        api.bindUserPhone(obj, (res) => {
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.switchTab({
            url: '/pages/zmall/index/index'
          });
        });
      }
    });
  }
})