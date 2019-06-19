import * as api from './assets/js/api';
import PathUtil from './assets/js/PathUtil';
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

    this.getActivitySetting();
    this.getPlatForm();
  },
  getActivitySetting() {
    api.getActivitySetting(null, (res) => {
      let activity = res.data;
      // rank-list-banner
      activity.adv_img = PathUtil.getFilePath(activity.adv_img);
      // rank-list-bg
      activity.details_img = PathUtil.getFilePath(activity.details_img);
      // share img
      activity.share_img = PathUtil.getFilePath(activity.share_img);

      this.globalData.activity = activity;
    });
  },
  getPlatForm() {
    wx.getSystemInfo({
      success: (res) => {
        if (res.platform == "devtools") {
          this.globalData.platform = 'pc';
        } else if (res.platform == "ios") {
          this.globalData.platform = 'ios';
        } else if (res.platform == "android") {
          this.globalData.platform = 'android';
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    appName: '押韵Rap',
    studyVideo: {
      // 切换视频次数，如果达到一定的次数，就需要弹出广告提示
      toggleVideoCount: 0,
      isFirstComeIn: true
    },
    // 活动
    activity: null,
    platform: null
  }
})