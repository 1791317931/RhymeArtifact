let CommonUtil = {
  toLogin() {
    wx.navigateTo({
      url: '/pages/authorition/index'
    });
  },
  copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

export default CommonUtil;