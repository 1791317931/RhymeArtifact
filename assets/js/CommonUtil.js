import * as api from './api'
import PathUtil from './PathUtil';
import UrlUtil from './UrlUtil';

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function uuid() {
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

let CommonUtil = {
  toLogin(shouldBindPhone = false) {
    wx.navigateTo({
      url: `/pages/authorition/index?shouldBindPhone=${shouldBindPhone ? 'Y' : 'N'}`
    });
  },
  hasBindUserInfo() {
    let user = wx.getStorageSync('userInfo');

    if (!user) {
      // 登录
      UrlUtil.toLogin(false)
      return false
    }
    if (!user.mobile) {
      // 绑定手机号
      UrlUtil.toLogin(true)
      return false
    }

    return true
  },
  // 禁止出现正则、function
  copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  getShareTitle() {
    let app = getApp(),
    activity = app.globalData.activity;

    if (activity) {
      return activity.share_title;
    } else {
      app.globalData.appName;
    }
  },
  getShareImage() {
    let app = getApp(),
    activity = app.globalData.activity;

    if (activity) {
      return activity.share_img
    }
  },
  share() {
    return {
      title: CommonUtil.getShareTitle(),
      imageUrl: CommonUtil.getShareImage(),
      path: '/pages/main/index'
    };
  },
  uuid() {
    return uuid();
  },
  getPolicyParam(fn, completeFn, failFn) {
    api.getPolicyParam((obj) => {
      let OSSAccessKeyId = obj.accessid,
      host = obj.host,
      dir = obj.dir,
      policy = obj.policy,
      signature = obj.signature;

      fn && fn({
        OSSAccessKeyId,
        host,
        dir,
        policy,
        signature,
        getKey(subDir = '', path) {
          let key = dir;
          if (subDir) {
            key += subDir + '/';
          }
          return key + CommonUtil.uuid() + '.' + path.substring(path.lastIndexOf('.') + 1);
        }
      }, completeFn, failFn);
    });
  },
  getImageInfo(url, successFn, failFn, completeFn) {
    wx.getImageInfo({
      src: url,
      success: (res) => {
        successFn && successFn(res.path);
      },
      fail: (res) => {
        failFn && failFn(res);
      },
      complete: (res) => {
        completeFn && completeFn(res);
      }
    });
  }
};

export default CommonUtil;