let TipUtil = {
  message(title, duration = 3000) {
    wx.showToast({
      title,
      icon: 'none',
      duration
    });
  }
};

export default TipUtil;