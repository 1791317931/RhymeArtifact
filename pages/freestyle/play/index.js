import TipUtil from '../../../assets/js/TipUtil';
import CommonUtil from '../../../assets/js/CommonUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import PathUtil from '../../../assets/js/PathUtil';
import TimeUtil from '../../../assets/js/TimeUtil';
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadModalComponent: null,
    freestyleListComponent: null,
    freestylePosterComponent: null,
    audio: null,
    fs: null,
    user: null,
    playing: false,
    // 播放进度
    playPercent: 0,
    showMoreInfo: false,
    loadingUserInfo: true,
    showMine: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 保持不锁屏
    wx.setKeepScreenOn({
      keepScreenOn: true
    });

    let loadModalComponent = this.selectComponent('#loadModalComponent'),
    freestyleListComponent = this.selectComponent('#freestyleListComponent'),
    freestylePosterComponent = this.selectComponent('#freestylePosterComponent');

    this.setData({
      loadModalComponent,
      freestyleListComponent,
      freestylePosterComponent
    });
    freestyleListComponent.init(this);
    freestyleListComponent.setData({
      clickItem: (item) => {
        this.getById(item.id);
      }
    });

    this.initAudio();
    this.getById(options.id);

    if (options.showMine == 'Y') {
      this.setData({
        showMine: options.showMine
      });
      this.getMyInfo();
    } else if (options.userId) {
      this.getUserById(options.userId);
    }
    
    freestyleListComponent.getPage(1);
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
    this.data.audio.puase();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.audio.destroy();
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
  onShareAppMessage: function () {
    let data = this.data.fs;
    return {
      title: data.title,
      path: `/pages/freestyle/play/index?id=${data.id}`
    };
  },
  toggleFollow() {
    let user = this.data.user;
    if (user.is_follow) {
      api.cancelFollow({
        user_id: user.id
      }, (res) => {
        TipUtil.success('已取消关注');
        this.setData({
          'user.is_follow': 0
        });
      });
    } else {
      api.follow({
        user_id: user.id
      }, (res) => {
        TipUtil.success('已关注');
        this.setData({
          'user.is_follow': 1
        });
      });
    }
  },
  pick() {
    api.addFreestylePick({
      id: this.data.fs.id
    }, (res) => {
      this.setData({
        'fs.is_follow': ++this.data.fs.pick_num
      });
    });
  },
  generatePoster() {
    let data = this.data,
    user = data.user,
    fs = data.fs;

    if (!user || !fs) {
      TipUtil.message('数据不完善，无法生成海报')
      return;
    }

    fs.user = user;
    this.data.freestylePosterComponent.generatePoster(fs);
  },
  toggleLoading(loading) {
    this.data.loadModalComponent.setData({
      loading
    });
  },
  toggleLoadingUserInfo(loadingUserInfo) {
    this.setData({
      loadingUserInfo
    });
  },
  getMyInfo() {
    this.toggleLoadingUserInfo(true);

    api.getMyInfo({
      have: 'freestyle_count'
    }, (res) => {
      let user = res.data;
      user.avatarUrl = PathUtil.getFilePath(user.avatar);

      this.setData({
        user
      });
    }, () => {
      this.toggleLoadingUserInfo(false);
    });
  },
  getUserById(id) {
    this.toggleLoadingUserInfo(true);

    api.getUserById({
      id,
      have: 'freestyle_count,is_follow'
    }, (res) => {
      let user = res.data;
      user.avatarUrl = PathUtil.getFilePath(user.avatar);

      this.setData({
        user
      });
    }, () => {
      this.toggleLoadingUserInfo(false);
    });
  },
  getById(id) {
    this.toggleLoading(true);

    api.getFreestyleById({
      id
    }, (res) => {
      let data = res.data;
      data.duration = Math.ceil(data.duration / 1000);
      data.totalTimeArr = TimeUtil.numberToArr(data.duration);

      let playTime = 0;
      data.playTime = playTime;
      data.playTimeArr = TimeUtil.numberToArr(playTime);
      data.backgroundImage = '/assets/imgs/fs-poster-bg.png';

      this.setData({
        fs: data
      });
      this.startPlay();
    }, () => {
      this.toggleLoading(false);
    });
  },
  initAudio() {
    let audio = wx.createInnerAudioContext(),
    option = {
      // 仅在ios生效（IOS默认）  是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音
      obeyMuteSwitch: false
    };

    wx.setInnerAudioOption({
      option
    });

    this.setData({
      audio
    });

    this.bindAudioEvent();
  },
  bindAudioEvent() {
    let audio = this.data.audio;

    audio.autoplay = true;
    audio.onTimeUpdate(() => {
      this.audioTimeUpdate(audio.duration, audio.currentTime);
    });

    audio.onError((res) => {
      this.audioError();
    });

    audio.onEnded((res) => {
      this.audioEnded();
    });
  },
  startPlay() {
    let data = this.data,
    fs = data.fs,
    audio = data.audio;

    audio.src = PathUtil.getFilePath(fs.mixture_url || fs.origin_url);
    this.setData({
      playing: true
    });

    audio.seek(0);
    audio.play();
  },
  continuePlay() {
    let audio = this.data.audio;

    this.setData({
      playing: true
    });

    // 播放音频
    audio.play();
  },
  pausePlay(e) {
    let audio = this.data.audio;

    this.setData({
      playing: false
    });

    audio.pause();
  },
  audioEnded() {
    let audio = this.data.audio,
    fs = this.data.fs;

    let playTime = 0;
    fs.playTime = playTime;
    fs.playTimeArr = TimeUtil.numberToArr(playTime);

    this.setData({
      playing: false,
      playPercent: 0,
      fs
    });

    audio.seek(0);
  },
  audioError(e) {
    if (e.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
      TipUtil.message('播放失败');
    }
    this.audioEnded();
  },
  audioTimeUpdate(totalTime, time) {
    this.caculateSurplusTime(totalTime, time);
  },
  // 计算剩余时间
  caculateSurplusTime(totalTime, currentTime) {
    let fs = this.data.fs;

    currentTime = parseInt(currentTime);
    fs.playTime = currentTime;
    fs.playTimeArr = TimeUtil.numberToArr(currentTime);

    let playPercent = currentTime / fs.duration;

    this.setData({
      fs,
      playPercent
    });
  },
  getFsPageCallback(e) {
    this.setData({
      showMoreInfo: !!e.detail.total_pages
    });
  },
  getMoreFs() {
    this.data.freestyleListComponent.onReachBottom();
  }
})