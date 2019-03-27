import TipUtil from '../../../assets/js/TipUtil';
import PathUtil from '../../../assets/js/PathUtil';
import * as api from '../../../assets/js/api';
import FileType from '../../../assets/js/FileType';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import TimeUtil from '../../../assets/js/TimeUtil';
import CommonUtil from '../../../assets/js/CommonUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scales: [],
    hideSaveModal: true,
    // 录制状态：ready（准备就绪） recording（录制中）
    recordState: 'ready',
    recordOption: {
      // 最长4分钟
      duration: 4 * 60 * 1000,
      format: 'mp3'
    },
    RM: null,
    BAC: null,
    // 录制的音频
    RAC: null,
    recordForm: {
      beatId: null,
      lyrics: '',
      duration: '',
      fileSize: 0,
      path: '',
      title: '',
      author: ''
    },
    beatItem: null,
    recordRule: {
      title: {
        length: 30
      },
      // 作词
      author: {
        length: 30
      }
    },
    tryPlaying: false,
    // 试听伴奏和已录制音频是否播放结束，当再次点击试听，可以重新播放
    tryPlayEnded: false,
    // 模式  record（录制） try（试听）
    mode: 'record',
    // 记录指针初始位置
    startTryBeatPageX: null,
    startTryBeatPercent: null,
    startRecordBeatPageX: null,
    startRecordBeatPercent: null,
    trackContainerWidth: null,
    hideSubmittingModal: true,
    // 两组M、S
    firstTrackButton: null,
    secondTrackButton: null,
    firstVideoMuted: false,
    secondVideoMuted: false,
    // 0 ~ 1
    volume: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo'),
    beatItem = JSON.parse(options.beatItem);
    beatItem.beatTimeArr = TimeUtil.numberToArr(Math.ceil(beatItem.beat_duration / 1000));

    this.setData({
      'recordForm.author': userInfo.nickName,
      'recordForm.beatId': beatItem.id,
      beatItem
    });
    this.caculateTryBeatTime(0);
    this.caculateRecordBeatTime(0);

    let scales = [];
    for (let i = 0; i <= 50; i += 2) {
      if (i % 10 == 0) {
        scales.push(i / 10);
      } else {
        scales.push('');
      }
    }
    this.setData({
      scales
    });

    let RM = wx.getRecorderManager(),
    BAC = wx.createInnerAudioContext(),
    RAC = wx.createInnerAudioContext();

    const query = wx.createSelectorQuery();
    query.select('#track-container').boundingClientRect();
    query.exec((res) => {
      this.setData({
        trackContainerWidth: res[0].width 
      });
    });

    this.setData({
      RM,
      BAC,
      RAC
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
    // 这里不能继续播放，调用BAC.play()无法播放
    if (this.data.mode == 'try' && this.data.tryPlaying) {
      this.tryPlayStart();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.mode == 'try' && this.data.tryPlaying) {
      this.tryPlayPause();

      this.changeTryPlayState(true);
    }

    if (this.data.mode == 'record' && this.data.recordState == 'recording') {
      this.endRecord();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.mode == 'record' && this.data.recordState == 'recording') {
      this.endRecord();
    }
    
    this.data.BAC.destroy();
    this.data.RAC.destroy();
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
    if (e.from == 'menu') {
      return CommonUtil.shareApp(e);
    }
  },
  init() {
    let data = this.data,
    BAC = data.BAC,
    RAC = data.RAC,
    option = {
      // 仅在ios生效（IOS默认）  是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音
      obeyMuteSwitch: false
    };

    wx.setInnerAudioOption({
      option
    });

    this.bindBACEvent(BAC);
    this.bindRACEvent(RAC);
  },
  changeMode(mode) {
    this.setData({
      mode
    });
  },
  changeTryPlayState(tryPlaying) {
    this.setData({
      tryPlaying
    });
  },
  changeTryPlayEndedState(tryPlayEnded) {
    this.setData({
      tryPlayEnded
    });
  },
  // 计算试听-伴奏播放时长
  caculateTryBeatTime(time) {
    time = parseInt(time);

    let beatItem = this.data.beatItem;
    // 已播放时长
    beatItem.tryBeatTime = time;
    beatItem.tryBeatTimeArr = TimeUtil.numberToArr(time);
    beatItem.tryBeatTimePercent = (time / beatItem.totalTime * 100);
    this.setData({
      beatItem
    });
  },
  // 计算录制-伴奏播放时长
  caculateRecordBeatTime(time) {
    time = parseInt(time);

    let beatItem = this.data.beatItem;
    // 已播放时长
    beatItem.recordBeatTime = time;
    beatItem.recordBeatTimeArr = TimeUtil.numberToArr(time);
    beatItem.recordBeatTimePercent = (time / beatItem.totalTime * 100);
    this.setData({
      beatItem
    });
  },
  tryPlayStart() {
    let tryPlay = () => {
      let BAC = this.data.BAC,
      RAC = this.data.RAC;
      
      if (this.data.tryPlayEnded || this.data.mode == 'record') {
        // 这里不用修改palyedTime，会自动在tryAudioTimeUpdate方法中更新
        BAC.seek(0);
        RAC.seek(0);
        this.caculateTryBeatTime(0);
      } else {
        BAC.seek(this.data.beatItem.tryBeatTime);
        RAC.seek(this.data.beatItem.tryBeatTime);
      }

      BAC.play();
      this.changeTryPlayState(true);
      this.changeTryPlayEndedState(false);
      this.changeMode('try');

      // 如果有已经录制完成的音频
      if (this.data.recordForm.path) {
        RAC.play();
      }
    };

    // 正在录制，需要给出提示结束并生成一个音频
    if (this.data.recordState == 'recording') {
      wx.showModal({
        title: '系统提示',
        content: '是否立即结束录制并试听？',
        success: (res) => {
          if (res.confirm) {
            this.endRecord(() => {
              tryPlay();
            });
          }
        }
      });
    } else {
      tryPlay();
    }
  },
  tryPlayPause() {
    let BAC = this.data.BAC,
    RAC = this.data.RAC;

    BAC.pause();
    this.changeTryPlayState(false);

    // 如果有已经录制完成的音频
    if (this.data.recordForm.path) {
      RAC.pause();
    }
  },
  bindBACEvent(BAC) {
    BAC.onTimeUpdate((res) => {
      this.beatAudioTimeUpdate(BAC.currentTime);
    });

    BAC.onError((res) => {
      this.beatAudioError();
    });

    BAC.onEnded((res) => {
      this.beatAudioEnded();
    });

    BAC.src = this.data.beatItem.beat_url;
  },
  // 伴奏音频事件
  beatAudioTimeUpdate(time) {
    this.caculateTryBeatTime(time);
    if (this.data.mode == 'record') {
      this.caculateRecordBeatTime(time);
    }
  },
  beatAudioEnded() {
    if (this.data.mode == 'try') {
      this.changeTryPlayState(false);
      this.changeTryPlayEndedState(true);
    } else {
      // 如果正在录音，要强制结束
      TipUtil.message('录音音频已生成');
      this.endRecord();
    }
  },
  beatAudioError(e) {
    // 后期调试，根据错误给出提示信息
    if (this.data.mode == 'try') {
      this.changeTryPlayState(false);
    } else {
      this.changeRecordState(false);
    }
  },
  changeRecordState(recordState) {
    this.setData({
      recordState
    });
  },
  bindRACEvent(RAC) {
    RAC.onTimeUpdate((res) => {
      this.recordAudioTimeUpdate(RAC.currentTime);
    });

    RAC.onError((res) => {
      if (ConfigUtil.isDev()) {
        console.log('RAC.onError');
      }
      this.recordAudioError(res);
    });

    RAC.onEnded((res) => {
      if (ConfigUtil.isDev()) {
        console.log('RAC.onEnded');
      }
      
      this.recordAudioEnded();
    });
  },
  recordAudioTimeUpdate(time) {
    if (time > this.data.recordForm.duration) {
      this.recordAudioEnded(time);
    }
  },
  /**
   * 如果录制的音频播放完成，伴奏不一定播放完成，所以需要主动结束伴奏
   */
  recordAudioEnded(e) {
    let BAC = this.data.BAC;

    BAC.pause();
    this.changeTryPlayState(false);
    this.changeTryPlayEndedState(true);
  },
  recordAudioError(e) {
    // 后期调试，根据错误给出提示信息
    let BAC = this.data.BAC;

    BAC.pause(); 
    this.changeTryPlayState(false);
  },
  // ---------------------拖动指针--------------------------
  tryBeatTouchStart(e) {
    this.setData({
      startTryBeatPageX: e.touches[0].pageX,
      startTryBeatPercent: this.data.beatItem.tryBeatTimePercent / 100
    });

    if (this.data.tryPlaying) {
      this.tryPlayPause();
    }
  },
  moveTryBeatPointer(e) {
    let touches = e.touches,
    prePageX = this.data.startTryBeatPageX,
    pageX = e.touches[0].pageX,
    recordForm = this.data.recordForm;

    let width = pageX - prePageX,
    beatItem = this.data.beatItem,
    percent = width / this.data.trackContainerWidth,
    tryBeatTimePercent = this.data.startTryBeatPercent + percent;

    tryBeatTimePercent = Math.min(1, tryBeatTimePercent);
    tryBeatTimePercent = Math.max(0, tryBeatTimePercent);

    let time = tryBeatTimePercent * beatItem.totalTime;

    // 如果已经有被录制的音频，并且拖动的时间已经超出了被录制的音频总时长（录制的音频时长肯定<=伴奏音频），那么只能拖动到这个时长
    if (recordForm.path && time >= recordForm.duration / 1000) {
      time = recordForm.duration / 1000;
    }

    this.caculateTryBeatTime(time);
  },
  tryBeatTouchEnd(e) {
    this.tryPlayStart();
  },
  recordBeatTouchStart(e) {
    
  },
  moveRecordBeatPointer(e) {
    
  },
  recordBeatTouchEnd(e) {
    
  },
  // ---------------------拖动指针--------------------------
  beginRecord() {
    let record = () => {
      let RM = this.data.RM,
      BAC = this.data.BAC,
      RAC = this.data.RAC;

      RM.start(this.data.recordOption);
      RM.onStart(() => {
        // 左侧状态按钮全部重置
        this.setData({
          firstVideoMuted: false,
          secondVideoMuted: false,
          firstTrackButton: null,
          secondTrackButton: null
        });
        BAC.volume = this.data.volume;
        RAC.volume = this.data.volume;

        // 从头播放
        BAC.seek(0);
        BAC.play();
        // 暂停录制的音频播放
        RAC.pause();

        // 清空已经录制的音频
        this.setData({
          'recordForm.path': null
        });
        this.changeTryPlayState(false);
        this.changeRecordState('recording');
        this.changeMode('record');
      });
    };

    // 已经存在录制好的音频，需要提示是否重新录制
    if (this.data.recordForm.path) {
      wx.showModal({
        title: '系统提示',
        content: '存在已经录制完成的音频，是否重新录制？',
        success: (res) => {
          if (res.confirm) {
            record();
          }
        },
        fail: (res) => {

        }
      });
    } else {
      record();
    }
  },
  endRecord(callback) {
    let RM = this.data.RM,
    BAC = this.data.BAC,
    RAC = this.data.RAC;

    // 结束录制
    RM.stop();
    RM.onStop((res) => {
      BAC.pause();

      let recordForm = this.data.recordForm;
      recordForm.duration = res.duration;
      recordForm.fileSize = res.fileSize;
      recordForm.path = res.tempFilePath;
      this.setData({
        recordForm
      });

      RAC.src = res.tempFilePath;

      this.changeRecordState('ready');

      if (typeof callback == 'function') {
        callback();
      }
    });
  },
  // 录制少于15秒，不能发布
  saveRecord() {
    let MIN_TIME = 15;

    let toSave = () => {
      this.tryPlayPause();

      if (this.data.recordState == 'recording') {
        this.endRecord(() => {
          this.toggleSaveModal(false);
        });
      } else {
        this.toggleSaveModal(false);
      }
    };

    // 正在录制或者暂停
    if (this.data.recordState == 'recording') {
      if (this.data.beatItem.recordBeatTime < MIN_TIME) {
        TipUtil.message('请至少录制' + MIN_TIME + '秒后再发布');
      } else {
        wx.showModal({
          title: '系统提示',
          content: '是否结束录制并发布',
          success: (res) => {
            if (res.confirm) {
              toSave();
            }
          },
          fail: (res) => {

          }
        });
      }
    } else if (this.data.recordForm.path) {
      if (this.data.recordForm.duration < MIN_TIME * 1000) {
        TipUtil.message('请至少录制' + MIN_TIME + '秒后再发布');
      } else {
        toSave();
      }
    } else {
      TipUtil.message('请录制后再发布');
    }
  },
  toggleSaveModal(hideSaveModal) {
    this.setData({
      hideSaveModal
    });
  },
  changeTitle(e) {
    this.setData({
      'recordForm.title': e.detail.value.trim()
    });
  },
  changeContent(e) {
    this.setData({
      'recordForm.content': e.detail.value.trim()
    });
  },
  closeSaveModal() {
    this.toggleSaveModal(true);
  },
  toggleSubmitting(hideSubmittingModal) {
    this.setData({
      hideSubmittingModal
    });
  },
  uploadRecordAndSubmit() {
    this.closeSaveModal();
    let form = this.data.recordForm;
    if (!form.title) {
      TipUtil.message('请填写歌名');
      return;
    }

    if (!form.author) {
      TipUtil.message('请填写作词');
      return;
    }

    this.uploadToOss();
  },
  uploadToOss() {
    this.toggleSubmitting(false);

    CommonUtil.getPolicyParam((data) => {
      let form = this.data.recordForm,
      path = form.path,
      key = data.getKey('music', path),
      host = data.host;
      
      // 上传
      wx.uploadFile({
        url: host,
        // 本地文件路径
        filePath: path,
        name: 'file',
        formData: {
          OSSAccessKeyId: data.OSSAccessKeyId,
          policy: data.policy,
          signature: data.signature,
          key,
          success_action_status: '200'
        },
        success: (res) => {
          let param = {
            beat_id: form.beatId,
            origin_url: '/' + key,
            music_lyric: form.lyrics,
            music_title: form.title,
            music_author: form.author,
            music_duration: form.duration,
            music_size: form.fileSize
          };

          api.createMusic(param, (res) => {
            TipUtil.message('发布成功');
            setTimeout(() => {
              let pages = getCurrentPages();
              pages[pages.length - 2].setData({
                targetPath: '/pages/create/createMusicList/index'
              });

              wx.navigateBack({
                delta: 1
              });
            }, 1000);
          }, () => {
            this.toggleSubmitting(true);
          });
        },
        fail: (res) => {
          this.toggleSubmitting(true);
          CommonUtil.tip.error('服务器繁忙，请稍后重试');
        }
      }, null, () => {
        this.toggleSubmitting(true);
      });
    });
  },
  toEditLyrics() {
    wx.navigateTo({
      url: '/pages/create/record/lyrics/index?content=' + this.data.recordForm.lyrics
    });
  },
  toggleFirstTrack(e) {
    if (this.data.mode != 'try') {
      return;
    }

    let value = e.target.dataset.value,
    BAC = this.data.BAC,
    RAC = this.data.RAC;

    if (value == 'M') {
      // 静音
      this.setData({
        firstVideoMuted: !this.data.firstVideoMuted,
        firstTrackButton: this.data.firstTrackButton == value ? null : value,
        // 如果录音是独奏，需要取消独奏
        secondTrackButton: this.data.secondTrackButton == 'S' ? null : this.data.secondTrackButton
      });

      BAC.volume = this.data.firstVideoMuted ? 0 : this.data.volume;
      RAC.volume = this.data.secondTrackButton == 'M' ? 0 : this.data.volume;
    } else if (value == 'S') {
      // 独奏
      this.setData({
        firstVideoMuted: false,
        secondVideoMuted: this.data.firstTrackButton == value ? false : true,
        firstTrackButton: this.data.firstTrackButton == value ? null : value,
        secondTrackButton: this.data.firstTrackButton == value ? null : 'M'
      });

      BAC.volume = this.data.volume;
      RAC.volume = this.data.secondVideoMuted ? 0 : this.data.volume;
    }
  },
  toggleSecondTrack(e) {
    if (this.data.mode != 'try') {
      return;
    }

    let value = e.target.dataset.value,
    BAC = this.data.BAC,
    RAC = this.data.RAC;

    if (value == 'M') {
      // 静音
      this.setData({
        secondVideoMuted: !this.data.secondVideoMuted,
        secondTrackButton: this.data.secondTrackButton == value ? null : value,
        // 如果伴奏是独奏，需要取消独奏
        firstTrackButton: this.data.firstTrackButton == 'S' ? null : this.data.firstTrackButton
      });

      BAC.volume = this.data.firstTrackButton == 'M' ? 0 : this.data.volume;
      RAC.volume = this.data.secondVideoMuted ? 0 : this.data.volume;
    } else if (value == 'S') {
      // 独奏
      this.setData({
        secondVideoMuted: false,
        firstVideoMuted: this.data.secondTrackButton == value ? false : true,
        secondTrackButton: this.data.secondTrackButton == value ? null : value,
        firstTrackButton: this.data.secondTrackButton == value ? null : 'M'
      });

      RAC.volume = this.data.volume;
      BAC.volume = this.data.firstVideoMuted ? 0 : this.data.volume;
    }
  }
})