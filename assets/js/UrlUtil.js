import ConfigUtil from 'ConfigUtil';
import CommonUtil from 'CommonUtil';
import TipUtil from 'TipUtil';
import PathUtil from 'PathUtil';

let UrlUtil = {
  isLogin: false,
  get(url, data, fn, completeFn) {
    UrlUtil.sendRequest(url, data, 'get', fn, completeFn);
  },
  post(url, data, fn, completeFn) {
    UrlUtil.sendRequest(url, data, 'post', fn, completeFn);
  },
  put(url, data, fn, completeFn) {
    UrlUtil.sendRequest(url, data, 'put', fn, completeFn);
  },
  delete(url, data, fn, completeFn) {
    UrlUtil.sendRequest(url, data, 'delete', fn, completeFn);
  },
  sendRequest(url, data, method, fn, completeFn) {
    let originUrl = url;
    if (!/^http/.test(url)) {
      url = PathUtil.getPath(url);
    }

    let param = {
      url,
      data,
      method,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success(res) {
        let statusCode = res.statusCode;
        if (statusCode == ConfigUtil.statusCode.NOT_AUTHORITION) {
          UrlUtil.toLogin();
        } else if (statusCode >= 400) {
          TipUtil.errorCode(res.data.code);
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

      },
      complete() {
        if (typeof completeFn == 'function') {
          completeFn();
        }
      }
    };

    wx.request(param);
  },
  toLogin() {
    if (!UrlUtil.isLogin) {
      UrlUtil.isLogin = true;
      CommonUtil.toLogin();
    }
  }
};

export default UrlUtil;