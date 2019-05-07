let TipUtil = {
  message(title, duration = 3000) {
    wx.showToast({
      title,
      icon: 'none',
      duration
    });
  },
  success(title, duration = 3000) {
    wx.showToast({
      title,
      icon: 'none',
      duration
    });
  },
  error(title = '服务器异常', duration = 3000) {
    wx.showToast({
      title,
      icon: 'none',
      duration
    });
  },
  errorCode(code, duration = 3000) {
    TipUtil.error(TipUtil.statusCode[code], duration);
  },
  statusCode: {
    422: '资源异常错误',
    1001: '参数缺少或者格式错误',
    1002: '调用第三方接口错误',
    10021: '获取session信息失败',
    10022: '解密微信用户数据失败',
    10023: '生成二维码失败',
    10024: '获取押韵数据失败',
    10025: 'oss错误'
  }
};

export default TipUtil;