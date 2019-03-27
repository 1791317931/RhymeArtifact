import * as api from '../../../assets/js/api';
import CommonUtil from '../../../assets/js/CommonUtil';
import TipUtil from '../../../assets/js/TipUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    playIndex: null,
    loading: false,
    // 课程分组id
    courseId: null,
    // 播放记录章节id
    videoRecordId: null,
    // 播放记录时间
    seekTime: null,
    videoContext: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      courseId: options.id,
      videoContext: wx.createVideoContext('studyVideo')
    });

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
    this.setHistory();
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
    // 找出播放记录
    let videoPlayRecord = wx.getStorageSync('videoPlayRecord') || {},
    data = this.data,
    courseId = data.courseId,
    course = videoPlayRecord[courseId];

    // 查看播放记录
    if (course) {
      this.setData({
        videoRecordId: course.videoId,
        seekTime: course.seekTime
      });
    }

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

      let playIndex = 0,
      data = this.data,
      seekTime = data.seekTime,
      videoRecordId = data.videoRecordId;
      if (videoRecordId) {
        for (let i = 0; i < list.length; i++) {
          if (videoRecordId == list[i].id) {
            playIndex = i;
            break;
          }
        }
      } else {
        // 如果没有播放记录，直接播放第一个
        videoRecordId = list[0].id;
        seekTime = 0;
      }

      this.setData({
        list,
        playIndex,
        videoRecordId,
        seekTime
      });

      let videoContext = data.videoContext;
      // 如果seekTime超出了视频总时长，会自动重新播放
      videoContext.seek(seekTime);
      videoContext.play();

      this.toggleLoading(true);
    });
  },
  toggleVideoItem(e) {
    let index = e.currentTarget.dataset.index,
    data = this.data,
    videoContext = data.videoContext,
    videoId = data.list[index].id,
    seekTime = 0;

    this.setData({
      playIndex: index,
      videoRecordId: videoId,
      seekTime
    });

    this.setHistory();
    videoContext.seek(seekTime);
    videoContext.play();
  },
  bindTimeUpdate(e) {
    this.setData({
      seekTime: e.detail.currentTime
    });
  },
  bindEnded(e) {
    this.setHistory();
  },
  bindError(e) {
    TipUtil.message('资源加载出错，请重试');
    // if (e.type == 'error') {
    //   TipUtil.message('资源加载出错，请重试');
    // }
  },
  setHistory() {
    let data = this.data,
    videoPlayRecord = wx.getStorageSync('videoPlayRecord') || {};
    videoPlayRecord[data.courseId + ''] = {
      videoId: data.videoRecordId,
      seekTime: data.seekTime
    };

    wx.setStorageSync('videoPlayRecord', videoPlayRecord);
  }
})