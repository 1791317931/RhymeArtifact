let shareRandomImgs = ['random-1.png', 'random-2.png', 'random-3.png', 'random-4.png', 'random-5.png', 'random-6.png'],
CommonUtil = {
  toLogin() {
    wx.navigateTo({
      url: '/pages/authorition/index'
    });
  },
  copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  getShareImage() {
    return '/assets/imgs/share/' + shareRandomImgs[Math.floor(Math.random() * 5) + 2];
  },
  shareApp(e) {
    // 点击右上角按钮分享
    if (e.from == 'menu') {
      return {
        title: 'xxxxx',
        imageUrl: CommonUtil.getShareImage(),
        path: '/pages/main/index',
        success: (res) => {

        },
        fail(res) {

        },
        complete(res) {

        }
      };
    }
  }
};

export default CommonUtil;