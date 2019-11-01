import ConfigUtil from 'ConfigUtil';
import CommonUtil from 'CommonUtil';
import TipUtil from 'TipUtil';
import PathUtil from 'PathUtil';

let UrlUtil = {
  isLogin: false,
  get(url, data, fn, completeFn, failFn) {
    UrlUtil.sendRequest(url, data, 'get', fn, completeFn, failFn);
  },
  post(url, data, fn, completeFn, failFn) {
    UrlUtil.sendRequest(url, data, 'post', fn, completeFn, failFn);
  },
  put(url, data, fn, completeFn, failFn) {
    UrlUtil.sendRequest(url, data, 'put', fn, completeFn, failFn);
  },
  delete(url, data, fn, completeFn, failFn) {
    UrlUtil.sendRequest(url, data, 'delete', fn, completeFn, failFn);
  },
  sendRequest(url, data, method, fn, completeFn, failFn) {
    let originUrl = url;
    if (!/^http/.test(url)) {
      url = PathUtil.getPath(url);
    }

    let userInfo = wx.getStorageSync('userInfo')
    if (url.indexOf('authorizations') == -1 && url.indexOf('getAuthPhone') == -1 && !userInfo) {
        UrlUtil.toLogin()
        return
    }

    let param = {
      url,
      data,
      method,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
        'rapper-device-type': 'wxapp',
        'rapper-third-type': 'wxapp'
      },
      success(res) {
        let statusCode = res.statusCode;
        if (statusCode == ConfigUtil.statusCode.NOT_AUTHORITION) {
          UrlUtil.toLogin();
        } else if (statusCode >= 400) {
          let data = res.data;
          if (data.message) {
            TipUtil.error(data.message);
          } else {
            TipUtil.errorCode(res.data.status_code || res.data.code);
          }
          failFn && failFn();
        } else {
          fn && fn(res.data);
        }
      },
      fail(res) {
        let msg = res.errMsg || '';
        if (/^request:fail timeout/.test(msg)) {
          TipUtil.error('请求超时');
        } else if (/^request:fail Unable to resolve/.test(msg)) {
          TipUtil.error('请检查网络');
        } else {
          if (ConfigUtil.isProd()) {
            TipUtil.error();
          } else {
            TipUtil.error(JSON.stringify(res));
          }
        }

        failFn && failFn();
      },
      complete() {
        if (typeof completeFn == 'function') {
          completeFn();
        }
      }
    };

    wx.request(param);
  },
  toLogin(shouldBindPhone = false) {
    if (!UrlUtil.isLogin) {
      UrlUtil.isLogin = true;
      CommonUtil.toLogin(shouldBindPhone);
    }
  }
};

export default UrlUtil;