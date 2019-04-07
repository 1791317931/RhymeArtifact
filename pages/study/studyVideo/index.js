import * as api from '../../../assets/js/api';
import CommonUtil from '../../../assets/js/CommonUtil';
import PathUtil from '../../../assets/js/PathUtil';
import TipUtil from '../../../assets/js/TipUtil';
import PosterCanvasUtil from '../../../assets/js/components/PosterCanvasUtil';

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
    posterUrl: null,
    loadModal: null,
    // 是否需要分享（要求用户每天至少分享一次）
    // needShare: true
    needShare: false
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function (options) {
    // 保持不锁屏
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
    
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

    // let shareObj = wx.getStorageSync(shareKey) || {},
    // shareTimeStamp = shareObj.shareTimeStamp;
    // // 间隔小于24小时，不需要强制分享
    // if (shareTimeStamp && Date.now() - shareTimeStamp < 24 * 60 * 60 * 1000) {
    //   this.setData({
    //     needShare: false
    //   });
    // }

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
      path: '/pages/study/studyList/index?t=video&id=' + data.groupId + '&sId=' + item.id,
      success: (res) => {

      },
      fail(res) {

      },
      complete(res) {

      }
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
  share() {
    this.setData({
      needShare: false
    });
    wx.setStorageSync(shareKey, {
      shareTimeStamp: Date.now()
    });
  },
  toggleLoading(loading) {
    let loadModal = this.data.loadModal;

    loadModal.setData({
      loading
    });
  },
  getVideoList() {
    this.toggleLoading(true);

    let groupId = this.data.groupId,
    defaultImage = getApp().globalData.defaultImage;
    
    api.getVideoById({
      id: groupId,
      include: 'sections'
    }, (res) => {
      let list = res.data.sections.data;
      list.forEach((item, index) => {
        let section_cover = PathUtil.getFilePath(item.section_cover);
        item.section_cover = section_cover || defaultImage;
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

    if (!this.data.needShare) {
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
    let item = this.data.list[this.data.playIndex];
    PosterCanvasUtil.draw(this, item, 'video');
  },
  closePoster() {
    this.setData({
      posterUrl: null
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
  }
})