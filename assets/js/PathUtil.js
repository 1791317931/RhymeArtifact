import ConfigUtil from './ConfigUtil'

let PathUtil = {
  prodApiPrefix: 'https://rapper-api.miyupp.com/wxapp/',
  devApiPrefix: 'https://rapper-test.miyupp.com/wxapp/',
  prodNewApiPrefix: 'https://rapper-api.miyupp.com/api/',
  devNewApiPrefix: 'https://rapper-test.miyupp.com/api/',
  prodFilePrefix: 'https://file.ihammer.cn',
  // devFilePrefix: 'https://oss.miyupp.com',
  devFilePrefix: 'https://rappertest.oss-cn-beijing.aliyuncs.com',
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
        // return PathUtil.prodFilePrefix + url;
        return PathUtil.devFilePrefix + url;
      }
    }

    return url;
  },
  getAvatar(url) {
    if (!url) {
      return '/assets/imgs/avatar-default.png';
    }

    if (!/^http/.test(url)) {
      if (ConfigUtil.isProd()) {
        return PathUtil.prodFilePrefix + url;
      } else {
        return PathUtil.devFilePrefix + url;
      }
    }

    return url;
  },
  // 资源文件存放到oss
  getOssImg(url) {
    return 'https://miyupp.oss-cn-beijing.aliyuncs.com/wxapp/' + url
  },
  getResourceFile(url) {
    if (!url) {
      return '/assets/imgs/logo.png';
    }

    if (!/^http/.test(url)) {
      return PathUtil.prodFilePrefix + url;
    }

    return url;
  }
};

export default PathUtil;