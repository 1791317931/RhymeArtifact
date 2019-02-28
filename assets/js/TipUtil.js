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
    wx.showToast({
      code,
      icon: 'none',
      duration
    });
  }
};

export default TipUtil;