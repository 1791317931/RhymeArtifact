// pages/authorition/index.js
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
    /**
     * 在这一步的开发中，一定要按照这样的顺序 
     * 1. 小程序请求login，拿到code 然后传给服务端； 
     * 2.服务端拿到code 到微信服务器拿到sessionKey ；
     * 3.然后小程序调用getuserinfo接口拿到encryptedData，iv,然后给服务端；
     * 4.服务端拿到客户端的encryptedData，vi还有之前的sessionKey去解密得到 unionId等用户信息；
     * 不然就会出现你这样的问题，你这种情况偶然出现的原因就是 
     * 你在服务端还未去获取sessionKey的时候你就去调用了getuserinfo，有时候你会比服务端快，有时候你会比服务端慢，所以就出现了偶然性
     */

    // 1、先在微信服务器登录
    // wx.login({
    //   success: (res) => {
    //     // 2、服务端拿到code 到微信服务器拿到sessionKey
    //     let code = res.code;
    //     api.getSessionToken({
    //       code
    //     }, (res) => {
    //       if (res.code == 200) {
    //         let sessionToken = res.data;
    //         // 3、调用getuserinfo接口拿到encryptedData，iv,然后给服务端
    //         wx.getUserInfo({
    //           success: (res) => {
    //             let encryptedData = res.encryptedData,
    //               iv = res.iv,
    //               userInfo = res.userInfo;
    //             wx.setStorageSync('userInfo', userInfo);

    //             userInfo.sessionToken = sessionToken;
    //             userInfo.encryptedData = encryptedData;
    //             userInfo.iv = iv;

    //             // 4、服务端拿到客户端的encryptedData，vi还有之前的sessionToken去解密得到 unionId等用户信息；
    //             api.login(userInfo, (res) => {
    //               if (res.code == 200) {
    //                 CommonUtil.user.loginSuccess(res);
    //                 this.back();
    //               } else {
    //                 this.checkResult(res);
    //               }
    //             });
    //           }
    //         });
    //       } else {
    //         this.checkResult(res);
    //       }
    //     });
    //   }
    // });

    wx.getUserInfo({
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo);
        wx.reLaunch({
          url: '/pages/main/index'
        });
      }
    });
  }
})