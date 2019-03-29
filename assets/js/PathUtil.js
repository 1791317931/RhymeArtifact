import ConfigUtil from './ConfigUtil'

let PathUtil = {
  prodApiPrefix: 'https://rapper-api.miyupp.com/wxapp/',
  devApiPrefix: 'https://rapper-test.miyupp.com/wxapp/',
  prodFilePrefix: 'https://file.ihammer.cn',
  // devFilePrefix: 'http://miyupp.oss-cn-beijing.aliyuncs.com',
  devFilePrefix: 'https://file.ihammer.cn',
  getPath(url) {
    if (ConfigUtil.isProd()) {
      return PathUtil.prodApiPrefix + url;
    } else {
      return PathUtil.devApiPrefix + url;
    }
  },
  // 获取资源路径
  getFilePath(url) {
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