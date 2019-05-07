const ald = require('./utils/ald-stat.js')
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
    studyVideo: {
      // 切换视频次数，如果达到一定的次数，就需要弹出广告提示
      toggleVideoCount: 0,
      isFirstComeIn: true
    }
  }
})