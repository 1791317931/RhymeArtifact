let PathUtil = {
  filePrefix: 'https://file.ihammer.cn',
  // prefix: 'https://wapi.ihammer.cn/wxapi/',
  prefix: 'https://yayun.sydy1314.com/wxapp/',
  getPath(url) {
    return PathUtil.prefix + url;
  },
  // 获取资源路径
  getFilePath(url) {
    if (!/^http/.test(url)) {
      return PathUtil.filePrefix + url;
    }

    return url;
  }
};

export default PathUtil;