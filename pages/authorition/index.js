import * as api from '../../assets/js/api';
import ConfigUtil from '../../assets/js/ConfigUtil';
import TipUtil from '../../assets/js/TipUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {

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
            console.log(userInfo);
            wx.setStorageSync('userInfo', userInfo);

            let obj = {};
            obj.wx_code = code;
            obj.wx_encrypted_data = encryptedData;
            obj.wx_iv = iv;

            api.login(obj, (res) => {
              if (ConfigUtil.isSuccess(res.code)) {
                wx.setStorageSync('token', res.data.token);
                wx.switchTab({
                  url: '/pages/main/index'
                });
              } else {
                TipUtil.errorCode(res.code);
              }
            });
          }
        });
      }
    });
  }
})