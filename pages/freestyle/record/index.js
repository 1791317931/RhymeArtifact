import TipUtil from '../../../assets/js/TipUtil';
import PathUtil from '../../../assets/js/PathUtil';
import * as api from '../../../assets/js/api';
import FileType from '../../../assets/js/FileType';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import TimeUtil from '../../../assets/js/TimeUtil';
import CommonUtil from '../../../assets/js/CommonUtil';
import BackgroundAC from '../../../assets/js/components/backgroundAudio/BAC'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scales: [],
    showSaveModal: false,
    showUpdateBeatModal: false,
    showAKBLModal: false,
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
    // 0 ~ 1
    volume: 0.8,
    // 选中阿卡贝拉的情况下不用提示直接录制，没有选择阿卡贝拉的情况下提示选择伴奏。
    // 这个就第一次进入软件的时候提示用户选择过一次以后就没有了
    // beat akbl
    freestyleMode: null,
    readyModalComponent: null,
    defaultTotalTime: 4 * 60,
    user: null,
    // 页面是否即将被卸载
    beforeUnload: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 保持不锁屏
    wx.setKeepScreenOn({
      keepScreenOn: true
    });

    this.getUserInfo()

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

    let readyModalComponent = this.selectComponent('#readyModal');
    this.setData({
      RM,
      BAC,
      RAC,
      readyModalComponent
    });

    // 用户使用过录制选择beat后退出在进来显示上次选择beat
    let beatItem = wx.getStorageSync('beatItem');
    this.setBeatItem(beatItem);



    // this.setBeatItem();
    // this.setFreestyleMode('akbl');



    this.init();
    // this.getFreestyleTheme();
    this.getMyInfo();
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
    BackgroundAC.pausePlay()
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
      this.setData({
        beforeUnload: true
      });
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
    return CommonUtil.share(e);
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
  getUserInfo() {
    api.getUserInfoByToken((res) => {
      let userInfo = res.data
      this.setData({
        'recordForm.author': userInfo.nickname
      });
    })
  },
  getFreestyleTheme() {
    api.getFreestyleTheme(null, (res) => {
      this.setData({
        'recordForm.title': res.data.name
      });
    });
  },
  getMyInfo() {
    api.getMyInfo(null, (res) => {
      let user = res.data;

      this.setData({
        user
      });
    });
  },
  setBeatItem(beatItem) {
    if (beatItem) {
      this.changeTryPlayState(false);
      this.data.BAC.seek(0);
      this.data.RAC.seek(0);

      this.setData({
        'recordForm.beatId': beatItem.id,
        'recordForm.path': null
      });
      this.data.BAC.src = beatItem.beat_try_url;

      wx.setStorageSync('beatItem', beatItem);
      this.setFreestyleMode('beat');
    } else {
      let totalTime = this.data.defaultTotalTime,
      timeArr = TimeUtil.numberToArr(totalTime);
      beatItem = {
        beatTimeArr: timeArr,
        totalTime
      };

      let prevFreestyleMode = wx.getStorageSync('freestyleMode');
      this.setFreestyleMode(prevFreestyleMode);
    }

    this.setData({
      beatItem
    });
    this.caculateTryBeatTime(0);
    this.caculateRecordBeatTime(0);
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

    if (this.data.recordForm.path) {
      this.caculateRecordBeatTime(time);
    }

    if (beatItem.tryBeatTimePercent >= 100) {
      this.beatAudioEnded();
    }
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

    let recordForm = this.data.recordForm;
    if (recordForm.path && time >= recordForm.duration / 1000) {
      this.recordAudioEnded();
    } else if (beatItem.recordBeatTimePercent >= 100) {
      this.recordAudioEnded();
    }
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
      }
      
      this.changeTryPlayState(true);
      this.changeTryPlayEndedState(false);
      this.changeMode('try');

      if (this.data.freestyleMode == 'beat') {
        BAC.volume = 0
        BAC.play();
      }

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
      let time = BAC.duration
      let timeArr = TimeUtil.numberToArr(Math.ceil(time));
      this.setData({
        'beatItem.beatTimeArr': timeArr,
        'beatItem.totalTime': time
      })

      this.beatAudioTimeUpdate(BAC.currentTime);
    });

    BAC.onError((res) => {
      this.beatAudioError();
    });

    BAC.onEnded((res) => {
      this.beatAudioEnded();
    });
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
        console.log('RAC.onError', res);
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
    if (this.data.freestyleMode == 'akbl') {
      this.caculateRecordBeatTime(time);
    }

    if (time > this.data.recordForm.duration / 1000) {
      this.recordAudioEnded(time);
    }
  },
  /**
   * 如果录制的音频播放完成，伴奏不一定播放完成，所以需要主动结束伴奏
   */
  recordAudioEnded(e) {
    let BAC = this.data.BAC;

    BAC.stop();
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
      startTryBeatPercent: this.data.beatItem.tryBeatTimePercent / 100,
      startRecordBeatPageX: e.touches[0].pageX,
      startRecordBeatPercent: this.data.beatItem.recordBeatTimePercent / 100
    });

    if (this.data.tryPlaying) {
      this.tryPlayPause();
    }
  },
  moveTryBeatPointer(e) {
    let touches = e.touches,
    prePageX = this.data.startTryBeatPageX,
    pageX = e.touches[0].pageX,
    beatItem = this.data.beatItem,
    recordForm = this.data.recordForm,
    duration = recordForm.duration / 1000;

    if (this.data.freestyleMode == 'akbl') {
      prePageX = this.data.startRecordBeatPageX;
    }

    if (this.data.freestyleMode == 'akbl') {
      let width = pageX - prePageX,
      percent = width / this.data.trackContainerWidth;
      let startRecordBeatPercent = this.data.startRecordBeatPercent + percent;

      startRecordBeatPercent = Math.min(1, startRecordBeatPercent);
      startRecordBeatPercent = Math.max(0, startRecordBeatPercent);

      // 这里X总时间
      let time = startRecordBeatPercent * beatItem.totalTime;

      // 如果已经有被录制的音频，并且拖动的时间已经超出了被录制的音频总时长（录制的音频时长肯定<=伴奏音频），那么只能拖动到这个时长
      if (time >= duration) {
        time = duration;
        this.recordAudioEnded();
      }

      this.caculateRecordBeatTime(time);
    } else {
      let width = pageX - prePageX,
      percent = width / this.data.trackContainerWidth;
      let tryBeatTimePercent = this.data.startTryBeatPercent + percent;

      tryBeatTimePercent = Math.min(1, tryBeatTimePercent);
      tryBeatTimePercent = Math.max(0, tryBeatTimePercent);

      let time = tryBeatTimePercent * beatItem.totalTime;
      
      // 如果已经有被录制的音频，并且拖动的时间已经超出了被录制的音频总时长（录制的音频时长肯定<=伴奏音频），那么只能拖动到这个时长
      if (recordForm.path && time >= duration) {
        time = duration;
        this.beatAudioEnded();
        this.recordAudioEnded();
      }

      this.caculateTryBeatTime(time);
    }
  },
  tryBeatTouchEnd(e) {
    let RAC = this.data.RAC,
    BAC = this.data.BAC;
    if (this.data.freestyleMode == 'akbl') {
      // 清唱
      RAC.seek(this.data.beatItem.recordBeatTime);
      RAC.play();
    } else if (this.data.recordForm.path) {
      // 同时播放
      BAC.seek(this.data.beatItem.tryBeatTime);
      RAC.seek(this.data.beatItem.recordBeatTime);
      BAC.play();
      RAC.play();
    } else {
      // 伴奏
      BAC.seek(this.data.beatItem.tryBeatTime);
      BAC.volume = this.data.volume;
      BAC.play();
    }
    this.changeTryPlayState(true);
    this.changeTryPlayEndedState(false);
  },
  // ---------------------拖动指针--------------------------
  beginRecord() {
    let freestyleMode = this.data.freestyleMode;
    if (!freestyleMode) {
      TipUtil.message('请选择beat');
      return;
    }

    let record = () => {
      this.data.readyModalComponent.show(() => {
        let RM = this.data.RM;

        RM.start(this.data.recordOption);
        RM.onStart(() => {
          this.changeRecordState('recording');
          this.clearForRecord();
        });
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
  clearForRecord() {
    let BAC = this.data.BAC,
    RAC = this.data.RAC;

    BAC.volume = this.data.volume;
    RAC.volume = this.data.volume;

    // 暂停录制的音频播放
    RAC.pause();

    // 清空已经录制的音频
    this.setData({
      'recordForm.path': null
    });
    this.changeTryPlayState(false);
    this.changeMode('record');

    // 伴奏录制
    if (this.data.beatItem.beat_try_url) {
      BAC.volume = this.data.volume;
      // 从头播放
      BAC.seek(0);
      BAC.play();
    } else {
      // 清唱
      this.recordWithoutBeat();
    }
  },
  recordWithoutBeat(time = 0) {
    this.caculateRecordBeatTime(time);

    let record = () => {
      setTimeout(() => {
        if (this.data.recordState == 'recording') {
          // 不能超过最大时间
          if (time >= this.data.defaultTotalTime) {
            this.endRecord();
          } else {
            this.recordWithoutBeat(++time);
          }
        }
      }, 1000);
    };

    record();
  },
  endRecord(callback) {
    let RM = this.data.RM,
    BAC = this.data.BAC,
    RAC = this.data.RAC;

    // 结束录制
    RM.stop();

    if (this.data.beforeUnload) {
      BAC.pause();
      return;
    }

    wx.showLoading({
      title: '音频保存中'
    });

    RM.onStop((res) => {
      wx.hideLoading();
      BAC.pause();

      let recordForm = this.data.recordForm;
      recordForm.duration = res.duration;
      // recordForm.duration = (2 * 60 + 56) * 1000;
      recordForm.fileSize = res.fileSize;
      recordForm.path = res.tempFilePath;
      this.setData({
        recordForm
      });

      RAC.src = res.tempFilePath;
      // RAC.src = 'http://file.ihammer.cn/voice/20190309221216_8839.wav';

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
          this.toggleSaveModal(true);
        });
      } else {
        this.toggleSaveModal(true);
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
  toggleSaveModal(showSaveModal) {
    this.setData({
      showSaveModal
    });
  },
  closeSaveModal() {
    this.toggleSaveModal(false);
  },
  changeTitle(e) {
    this.setData({
      'recordForm.title': e.detail.value.trim()
    })
  },
  changeAuthor(e) {
    this.setData({
      'recordForm.author': e.detail.value.trim()
    })
  },
  toggleSubmitting(hideSubmittingModal) {
    this.setData({
      hideSubmittingModal
    });
  },
  uploadRecordAndSubmit(e) {
    let form = this.data.recordForm;
    if (!form.title) {
      TipUtil.message('主题不能为空');
      return;
    }

    if (!form.author) {
      TipUtil.message('请填写作词');
      return;
    }

    api.saveFormId({
      formid: e.detail.formId
    });
    this.closeSaveModal();
    this.uploadToOss();
  },
  uploadToOss() {
    this.toggleSubmitting(false);

    CommonUtil.getPolicyParam((data) => {
      let form = this.data.recordForm,
      path = form.path,
      key = data.getKey('freestyle', path),
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
            origin_url: '/' + key,
            title: form.title,
            author: form.author,
            duration: form.duration,
            size: form.fileSize,
          };

          // 不提交beat
          // if (form.beatId) {
          //   param.beat_id = form.beatId;
          // }

          api.addFreestyle(param, (res) => {
            // TipUtil.message('服务器正在合成音频');
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/freestyle/play/index?id=' + res.data.id + '&userId=' + this.data.user.id
              });
            }, 1000);
          }, () => {
            this.toggleSubmitting(true);
          });
        },
        fail: (res) => {
          this.toggleSubmitting(true);
          TipUtil.message('服务器繁忙，请稍后重试');
        }
      }, null, () => {
        this.toggleSubmitting(true);
      });
    });
  },
  chooseBeat() {
    let data = this.data;
    // 正在录制，不允许点击
    if (data.recordState == 'recording') {
      return;
    }

    if (data.recordForm.path) {
      this.toggleUpdateBeatModal(true);
    } else if (data.tryPlaying) {
      // 正在试听
      this.tryPlayPause();
      this.toChooseBeat();
    } else {
      this.toChooseBeat();
    }
  },
  toChooseBeat() {
    this.toggleUpdateBeatModal(false);
    this.setBeatItem();
    wx.navigateTo({
      url: '/pages/freestyle/beatList/index'
    });
  },
  chooseAKBL() {    
    let data = this.data;
    // 不能重复选择akbl
    if (data.freestyleMode == 'akbl') {
      return;
    }

    // 正在录制，不允许点击
    if (data.recordState == 'recording') {
      return;
    }

    if (data.recordForm.path) {
      this.toggleAKBLModal(true);
    } else if (data.tryPlaying) {
      // 正在试听
      this.tryPlayPause();
      this.toChooseAKBL();
    } else {
      this.toChooseAKBL();
    }
  },
  setFreestyleMode(freestyleMode) {
    wx.setStorageSync('freestyleMode', freestyleMode);
    this.setData({
      freestyleMode
    });
  },
  toggleUpdateBeatModal(showUpdateBeatModal) {
    this.setData({
      showUpdateBeatModal
    });
  },
  closeUpdateBeatModal() {
    this.toggleUpdateBeatModal(false);
  },
  toggleUpdateBeatModal(showUpdateBeatModal) {
    this.setData({
      showUpdateBeatModal
    });
  },
  toChooseAKBL() {
    this.setBeatItem();
    this.setFreestyleMode('akbl');
    this.setData({
      'recordForm.path': null
    });

    this.beginRecord();
    this.closeAKBLModal();
  },
  closeAKBLModal() {
    this.toggleAKBLModal(false);
  },
  toggleAKBLModal(showAKBLModal) {
    this.setData({
      showAKBLModal
    });
  }
})