import * as api from './api'

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function uuid() {
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

let CommonUtil = {
  shareRandomImgs: ['random-2.png', 'random-3.png', 'random-4.png', 'random-5.png', 'random-6.png'],
  shareRandomMsgs: ['rapper们都喜欢玩的原来…', '押韵神器rapper都在玩的小…', '[新说唱]2019年度导师竟然…', '[所有rap]2019年度都喜欢…', '[红花会]2019年全新最火小…'],
  toLogin() {
    wx.navigateTo({
      url: '/pages/authorition/index'
    });
  },
  // 禁止出现正则、function
  copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  getDefaultUserImg() {
    return '/assets/imgs/logo.png';
  },
  getShareRandom() {
    return parseInt(Math.random() * 5);
  },
  getShareImage(random) {
    if (isNaN(random)) {
      random = CommonUtil.getShareRandom();
    }

    return '/assets/imgs/share/' + CommonUtil.shareRandomImgs[random];
  },
  shareApp(e) {
    // 点击右上角按钮分享
    if (e.from == 'menu') {
      let random = CommonUtil.getShareRandom();

      return {
        title: CommonUtil.shareRandomMsgs[random],
        imageUrl: CommonUtil.getShareImage(random),
        path: '/pages/main/index',
        success: (res) => {

        },
        fail(res) {

        },
        complete(res) {

        }
      };
    }
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