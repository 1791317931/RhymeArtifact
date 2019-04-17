// {
//   "selectedIconPath": "assets/imgs/freestyle-active.png",
//     "iconPath": "assets/imgs/freestyle.png",
//       "pagePath": "pages/freestyle/index/index",
//         "text": "Freestyle"
// },

App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    });

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '系统已更新，请重启小程序！',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });
  },
  globalData: {
    userInfo: null,
    appName: '押韵Rap',
    defaultImage: '/assets/imgs/default.png'
  }
})