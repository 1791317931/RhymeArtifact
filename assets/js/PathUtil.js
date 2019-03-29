import ConfigUtil from './ConfigUtil'

let PathUtil = {
  prodApiPrefix: 'https://wapi.ihammer.cn/wxapi/',
  devApiPrefix: 'https://yayun.sydy1314.com/wxapp/',
  prodFilePrefix: 'https://file.ihammer.cn',
  devFilePrefix: 'http://miyupp.oss-cn-beijing.aliyuncs.com',
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