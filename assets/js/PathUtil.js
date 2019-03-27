import ConfigUtil from './ConfigUtil'

let PathUtil = {
  prodFilePrefix: 'https://file.ihammer.cn',
  // devFilePrefix: 'http://miyupp.oss-cn-beijing.aliyuncs.com',
  prodPrefix: 'https://wapi.ihammer.cn/wxapi/',
  devPrefix: 'https://yayun.sydy1314.com/wxapp/',
  getPath(url) {
    if (ConfigUtil.isProd()) {
      return PathUtil.prodPrefix + url;
    } else {
      return PathUtil.devPrefix + url;
    }
  },
  // 获取资源路径
  getFilePath(url) {
    if (!/^http/.test(url)) {
      if (ConfigUtil.isProd()) {
        return PathUtil.prodFilePrefix + url;
      } else {
        return PathUtil.prodFilePrefix + url;
      }
    }

    return url;
  }
};

export default PathUtil;