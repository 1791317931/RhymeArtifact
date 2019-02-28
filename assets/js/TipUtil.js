let TipUtil = {
  message(title, duration = 3000) {
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
    1003: '登录失败'
  }
};

export default TipUtil;