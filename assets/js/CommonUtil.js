let CommonUtil = {
  shareRandomImgs: ['random-2.png', 'random-3.png', 'random-4.png', 'random-5.png', 'random-6.png'],
  shareRandomMsgs: ['rapper们都喜欢玩的原来…', '押韵神器rapper都在玩的小…', '[新说唱]2019年度导师竟然…', '[所有rap]2019年度都喜欢…', '[红花会]2019年全新最火小…'],
  toLogin() {
    wx.navigateTo({
      url: '/pages/authorition/index'
    });
  },
  copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  getShareRandom() {
    return parseInt(Math.random() * 5);
  },
  getShareImage(random) {
    if (isNaN(random)) {
      random = CommonUtil.getShareRandom();
    }

    return '/assets/imgs/share/' + CommonUtil.shareRandomImgs[random];
  },
  shareApp(e) {
    // 点击右上角按钮分享
    if (e.from == 'menu') {
      let random = CommonUtil.getShareRandom();

      return {
        title: CommonUtil.shareRandomMsgs[random],
        imageUrl: CommonUtil.getShareImage(random),
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