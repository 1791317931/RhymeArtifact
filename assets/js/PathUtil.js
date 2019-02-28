let PathUtil = {
  prefix: 'https://wapi.ihammer.cn/wxapi/',
  getPath(url) {
    return PathUtil.prefix + url;
  }
};

export default PathUtil;