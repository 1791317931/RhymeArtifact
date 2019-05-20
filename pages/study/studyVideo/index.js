import * as api from '../../../assets/js/api';
import CommonUtil from '../../../assets/js/CommonUtil';
import PathUtil from '../../../assets/js/PathUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import TipUtil from '../../../assets/js/TipUtil';

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    money: null,
    // 是否需要购买
    needBuy: false,
    // 是否已经购买
    hasBuy: false,
    freeNum: 0,
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
    uploadModal: null,
    // 是否需要分享（要求用户每天至少分享一次）
    musicPosterComponent: null,
    ad: null,
    TOGGLE_VIDEO_COUNT: 3,
    shouldShowAd: false,
    platform: null
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function (options) {
    let uploadModal = this.selectComponent('#uploadModal');

    this.setData({
      groupId: options.id,
      videoContext: wx.createVideoContext('studyVideo'),
      loadModal: this.selectComponent('#loadModal'),
      uploadModal,
      platform: app.globalData.platform
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
          this.toPlay();
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
    this.toPlay();
  },
  toPlay() {
    // 正常播放结束，可以下发游戏奖励
    this.setData({
      shouldShowAd: false
    });
    app.globalData.studyVideo.toggleVideoCount = 0;
    app.globalData.studyVideo.isFirstComeIn = false;
    this.data.videoContext.play();
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
      include: 'sections',
      hasBuy: 1
    }, (res) => {
      let obj = res.data,
      list = obj.sections.data,
      money = parseFloat(obj.money),
      hasBuy = obj.hasBuy,
      freeNum = obj.free_num;

      list.forEach((item, index) => {
        let section_cover = PathUtil.getFilePath(item.section_cover);
        item.section_cover = section_cover;
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
        seekTime,
        money,
        hasBuy,
        freeNum
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
    if (this.data.shouldShowAd || this.data.needBuy) {
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
  // 判断是否需要显示广告
  needBuyCourse() {
    let data = this.data,
    hasBuy = data.hasBuy,
    freeNum = data.freeNum,
    playIndex = data.playIndex,
    money = data.money;

    // 已经购买付费
    if (hasBuy) {
      return false;
    }

    // 是否全部免费
    if (money == 0) {
      return false;
    } else {
      // 是否需要付费
      return playIndex + 1 > freeNum;
    }
  },
  // 判断是否应该显示广告
  judgeShowAd() {
    let data = this.data,
    globalData = app.globalData,
    needBuy = this.needBuyCourse(),
    money = data.money;

    this.setData({
      needBuy
    });

    // 买过或者需要付费，都不需要显示广告
    if (data.hasBuy || money > 0) {
      this.setData({
        shouldShowAd: false
      });
    } else {
      if (!globalData.studyVideo.isFirstComeIn) {
        // 切换次数+1
        let count = ++globalData.studyVideo.toggleVideoCount;
        this.setData({
          shouldShowAd: count >= this.data.TOGGLE_VIDEO_COUNT
        });
      } else {
        this.setData({
          shouldShowAd: true
        });
      }
    }
  },
  playVideo(videoId, seekTime) {
    let data = this.data,
    videoContext = data.videoContext;
    // 如果seekTime超出了视频总时长，会自动重新播放
    videoContext.seek(seekTime);

    this.judgeShowAd();

    if (this.data.hasBuy) {
      videoContext.play();
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
    let index = this.data.playIndex;
    let item = this.data.list[index];
    this.getPosterInfo(item, index, () => {
      this.data.musicPosterComponent.generatePoster(item, 'video');
    });
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
  },
  getPosterInfo(item, index, callback) {
    // 已经获取过本地图片
    if (item.temp_section_cover) {
      callback && callback(path);
      return;
    }

    wx.showLoading({
      title: '海报生成中...',
    });
    wx.getImageInfo({
      src: item.section_cover,
      success: (res) => {
        let path = res.path;
        this.setData({
          [`list[${index}].temp_section_cover`]: path
        });
        callback && callback(path);
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  toggleUploading(loading) {
    let uploadModal = this.data.uploadModal;

    uploadModal.setData({
      loading
    });
  },
  toBuy() {
    let uploadModal = this.data.uploadModal;
    if (uploadModal.isLoading()) {
      return;
    }

    this.toggleUploading(true);
    api.buyCourseById({
      courseId: this.data.groupId
    }, (res) => {
      let data = res.data,
      packageParam = data.package;

      wx.requestPayment({
        ...packageParam,
        success: (res) => {
          this.init();
        },
        fail: (res) => {
          if (ConfigUtil.isDev()) {
            wx.showModal({
              title: 'x',
              content: '' + JSON.stringify(res),
            });
          } else {
            if (!/cancel/.test(res.errMsg || '')) {
              TipUtil.error('支付失败');
            }
          }
        }
      });
    }, () => {
      this.toggleUploading(false);
    });
  }
})