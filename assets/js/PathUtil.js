import ConfigUtil from './ConfigUtil'

let PathUtil = {
  prodApiPrefix: 'https://rapper-api.miyupp.com/wxapp/',
  devApiPrefix: 'https://rapper-test.miyupp.com/wxapp/',
  prodNewApiPrefix: 'https://rapper-api.miyupp.com/api/',
  devNewApiPrefix: 'https://rapper-test.miyupp.com/api/',
  prodFilePrefix: 'https://file.ihammer.cn',
  devFilePrefix: 'https://oss.miyupp.com',
  // 老接口
  getPath(url) {
    if (ConfigUtil.isProd()) {
      return PathUtil.prodApiPrefix + url;
    } else {
      return PathUtil.devApiPrefix + url;
    }
  },
  // 新接口
  getNewPath(url) {
    if (ConfigUtil.isProd()) {
      return PathUtil.prodNewApiPrefix + url;
    } else {
      return PathUtil.devNewApiPrefix + url;
    }
  },
  // 获取资源路径
  getFilePath(url) {
    if (!url) {
      return '/assets/imgs/logo.png';
    }

    if (!/^http/.test(url)) {
      if (ConfigUtil.isProd()) {
        return PathUtil.prodFilePrefix + url;
      } else {
        return PathUtil.devFilePrefix + url;
      }
    }

    return url;
  }
};

export default PathUtil;