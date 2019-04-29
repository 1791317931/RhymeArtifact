import * as api from '../../../assets/js/api';
import CommonUtil from '../../../assets/js/CommonUtil';
import PathUtil from '../../../assets/js/PathUtil';
import TipUtil from '../../../assets/js/TipUtil';

let shareKey = 'shareObj';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    playIndex: null,
    loading: false,
    // 课程分组id
    groupId: null,
    // 点击分享时，进入要播放的章节id
    shareSectionId: null,
    // 播放记录章节id
    videoRecordId: null,
    // 播放记录时间
    seekTime: null,
    videoContext: null,
    loadModal: null,
    // 是否需要分享（要求用户每天至少分享一次）
    musicPosterComponent: null,
    ad: null,
    // 切换视频次数，如果达到一定的次数，就需要弹出广告提示
    toggleVideoCount: 0,
    TOGGLE_VIDEO_COUNT: 3,
    shouldShowAd: false,
    // 第一次进入页面
    firstComeIn: true
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function (options) {   
    this.setData({
      groupId: options.id,
      videoContext: wx.createVideoContext('studyVideo'),
      loadModal: this.selectComponent('#loadModal')
    });

    if (options.sectionId) {
      this.setData({
        shareSectionId: options.sectionId
      });
    }

    let musicPosterComponent = this.selectComponent('#musicPosterComponent');
    this.setData({
      musicPosterComponent
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
    let data = this.data,
    item = data.list[data.playIndex];
    return {
      title: item.section_title,
      path: '/pages/study/studyList/index?t=video&id=' + data.groupId + '&sId=' + item.id
    };
  },
  init() {
    // 先判断是否是点击分享进来的
    if (!this.data.shareSectionId) {
      // 找出播放记录
      let videoPlayRecord = wx.getStorageSync('videoPlayRecord') || {},
      data = this.data,
      groupId = data.groupId,
      course = videoPlayRecord[groupId];

      // 查看播放记录
      if (course) {
        this.setData({
          videoRecordId: course.videoId,
          seekTime: course.seekTime
        });
      }
    } else {
      this.setData({
        videoRecordId: this.data.shareSectionId,
        seekTime: 0
      });
    }

    this.getVideoList();
  },
  loadRewardAd() {
    // 在页面中定义激励视频广告
    let ad = this.data.ad;
    let videoContext = this.data.videoContext;

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (!ad && wx.createRewardedVideoAd) {
      ad = wx.createRewardedVideoAd({
        adUnitId: 'adunit-b887b31034ada752'
      })
    }

    // 用户触发广告后，显示激励视频广告
    if (ad) {
      ad.onLoad((res) => {
        // 不能在这里pause，会在onClose后再次执行
      });

      ad.onError((res) => {
        this.rewardAdError();
      });

      ad.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          this.setData({
            shouldShowAd: false,
            toggleVideoCount: 0
          });
          videoContext.play();
        } else {
          // 播放中途退出，不下发游戏奖励
          TipUtil.message('请观看激励广告完毕后播放视频');
        }
      });

      ad.show().catch(() => {
        // 失败重试
        ad.load().then(() => {
          ad.show();
        }).catch(err => {
          this.rewardAdError();
        });
      });
    }
  },
  rewardAdError() {
    TipUtil.message('广告播放失败');
    // 继续播放视频
    videoContext.play();
  },
  toggleLoading(loading) {
    let loadModal = this.data.loadModal;

    loadModal.setData({
      loading
    });
  },
  getVideoList() {
    this.toggleLoading(true);

    let groupId = this.data.groupId;
    
    api.getVideoById({
      id: groupId,
      include: 'sections'
    }, (res) => {
      let list = res.data.sections.data;
      list.forEach((item, index) => {
        let section_cover = PathUtil.getFilePath(item.section_cover);
        item.section_cover = section_cover;
        this.getPosterInfo(index, section_cover);
        // 为了海报分享使用分辨参数
        item.groupId = groupId;
        item.sectionId = item.id;
      });

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

      this.playVideo(videoRecordId, seekTime);
    }, () => {
      this.toggleLoading(false);
    });
  },
  toggleVideoItem(e) {
    let index = e.currentTarget.dataset.index,
    data = this.data,
    videoContext = data.videoContext,
    videoRecordId = data.list[index].id,
    seekTime = 0;

    this.setData({
      playIndex: index,
      videoRecordId,
      seekTime
    });

    this.setHistory();
    this.playVideo(videoRecordId, seekTime);
  },
  bindPlay() {
    if (this.data.shouldShowAd) {
      this.data.videoContext.pause();
    }
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
    videoPlayRecord[data.groupId + ''] = {
      videoId: data.videoRecordId,
      seekTime: data.seekTime
    };

    wx.setStorageSync('videoPlayRecord', videoPlayRecord);
  },
  playVideo(videoId, seekTime) {
    let data = this.data,
    videoContext = data.videoContext;
    // 如果seekTime超出了视频总时长，会自动重新播放
    videoContext.seek(seekTime);

    // 第一次进入页面，展示广告播放提示
    if (this.data.firstComeIn) {
      this.setData({
        firstComeIn: false
      });
    } else {
      // 切换次数+1
      let count = ++this.data.toggleVideoCount;
      if (count >= this.data.TOGGLE_VIDEO_COUNT) {
        this.setData({
          shouldShowAd: true
        });
      }

      this.setData({
        toggleVideoCount: count
      });
    }

    api.addClickNum({
      id: videoId,
      type: 'course-sections'
    }, (res) => {
      this.data.list.forEach((item, index) => {
        if (item.id == videoId) {
          item.click_num++;

          this.setData({
            [`list[${index}]`]: item
          });
        }
      });
    });
  },
  generatePoster(e) {
    let item = this.data.list[this.data.playIndex];
    this.data.musicPosterComponent.generatePoster(item, 'video');
  },
  getPosterInfo(index, url) {
    if (!url) {
      return;
    }
    
    wx.getImageInfo({
      src: url,
      success: (res) => {
        this.setData({
          [`list[${index}].section_cover`]: res.path
        });
      },
      fail: (res) => {

      }
    });
  }
})