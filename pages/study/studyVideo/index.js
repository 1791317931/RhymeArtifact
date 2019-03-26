import * as api from '../../../assets/js/api';
import CommonUtil from '../../../assets/js/CommonUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    playIndex: null,
    loading: false,
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   id: options.id
    // });

    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return CommonUtil.shareApp(e);
  },
  init() {
    this.getVideoList();
  },
  toggleLoading(loading) {
    this.setData({
      loading
    });
  },
  getVideoList() {
    if (this.data.loading) {
      return;
    }

    this.toggleLoading(true);
    setTimeout(() => {
      let list = [
        {
          id: 1,
          title: '基础教程【从0学乐理-01】何为“音”',
          url: 'https://v.qikevip.com/course/1552495672665_94270.mp4',
          poster: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          play_num: 10002
        },
        {
          id: 2,
          title: '第二课【XJ012】如何让你的人声变干净—EQ教',
          poster: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          url: 'https://v.qikevip.com/course/1552495826683_425859.mp4',
          play_num: 11002
        },
        {
          id: 3,
          title: '金毛疯玩不愿回家，直接倒地装死，女主气哭, …狗，我不要了！',
          poster: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          url: 'https://v.qikevip.com/course/1552496505028_216057.mp4',
          play_num: 10202
        },
        {
          id: 4,
          title: '第三课【XJ012】如何让你的人声变干净—EQ教',
          poster: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          url: 'https://v.qikevip.com/course/1552496323056_623698.mp4',
          play_num: 10102
        }
      ];
      this.setData({
        list,
        playIndex: 0
      });

      this.toggleLoading(true);
    });
  }
})