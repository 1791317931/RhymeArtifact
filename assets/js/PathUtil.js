let PathUtil = {
  // prefix: 'https://wapi.ihammer.cn/wxapi/',
  prefix: 'https://yayun.sydy1314.com/wxapi/',
  getPath(url) {
    return PathUtil.prefix + url;
  }
};

export default PathUtil;