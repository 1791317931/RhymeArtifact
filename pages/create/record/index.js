import TipUtil from '../../../assets/js/TipUtil';
import PathUtil from '../../../assets/js/PathUtil';
import * as api from '../../../assets/js/api';
import FileType from '../../../assets/js/FileType';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import TimeUtil from '../../../assets/js/TimeUtil';

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
    // 伴奏音频
    BAC: null,
    recordForm: {
      beatId: 1,
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
    // 试听伴奏是否播放结束，当再次点击试听，可以重新播放
    tryPlayEnded: false,
    // 模式  record（录制） try（试听）
    mode: 'record',
    // 记录指针初始位置
    startTryBeatPageX: null,
    startTryBeatPercent: null,
    startRecordBeatPageX: null,
    startRecordBeatPercent: null,
    trackContainerWidth: null,
    hideSubmittingModal: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo'),
    beatItem = JSON.parse(options.beatItem);
    beatItem.beatTimeArr = TimeUtil.stringToArr(beatItem.beat_time);

    this.setData({
      'recordForm.author': userInfo.nickName,
      'recordForm.beatId': beatItem.beat_id,
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
    BAC = wx.createAudioContext('beatAudio');

    const query = wx.createSelectorQuery();
    query.select('#track-container').boundingClientRect();
    query.exec((res) => {
      this.setData({
        trackContainerWidth: res[0].width 
      });
    });

    this.setData({
      RM,
      BAC
    });
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
  onShareAppMessage: function () {

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
      let BAC = this.data.BAC;
      
      if (this.data.tryPlayEnded || this.data.mode == 'record') {
        // 这里不用修改palyedTime，会自动在tryAudioTimeUpdate方法中更新
        BAC.seek(0);
        this.caculateTryBeatTime(0);
      } else {
        BAC.seek(this.data.beatItem.tryBeatTime);
      }

      BAC.play();
      this.changeTryPlayState(true);
      this.changeTryPlayEndedState(false);
      this.changeMode('try');
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
    let BAC = this.data.BAC;

    BAC.pause();
    this.changeTryPlayState(false);
  },
  // 伴奏音频事件
  beatAudioTimeUpdate(e) {
    let time = e.detail.currentTime;

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
    pageX = e.touches[0].pageX;

    let width = pageX - prePageX,
    beatItem = this.data.beatItem,
    percent = width / this.data.trackContainerWidth,
    tryBeatTimePercent = this.data.startTryBeatPercent + percent;

    tryBeatTimePercent = Math.min(1, tryBeatTimePercent);
    tryBeatTimePercent = Math.max(0, tryBeatTimePercent);

    let time = tryBeatTimePercent * beatItem.totalTime;

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
      BAC = this.data.BAC;

      RM.start(this.data.recordOption);
      RM.onStart(() => {
        // 从头播放
        BAC.seek(0);
        BAC.play();

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
    BAC = this.data.BAC;

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

    this.toggleSubmitting(false);
    // 校验通过后，上传音频
    wx.uploadFile({
      url: PathUtil.getPath('upload-file'),
      filePath: form.path,
      name: 'file',
      formData: {
        title: form.title,
        type: FileType.VOICE
      },
      header: {
        'content-type': 'multipart/form-data'
      },
      success: (res) => {
        if (res.statusCode == 200) {
          let data = JSON.parse(res.data),
          filePath = data.data.file;

          let param = {
            beat_id: form.beatId,
            mixture_url: filePath,
            lyric_content: form.content,
            music_title: form.title,
            music_author: form.author,
            music_duration: form.duration,
            music_size: form.fileSize
          };

          api.createMusic(param, (res) => {
            this.toggleSubmitting(true);
            if (ConfigUtil.isSuccess(res.code)) {
              TipUtil.message('发布成功');
              setTimeout(() => {
                wx.navigateBack({
                  
                });
              }, 1000);
            } else {
              TipUtil.error(res.info);
            }
          });
        }
      },
      fail(e) {
        TipUtil.message('发布失败');
        this.toggleSubmitting(true);
      }
    });
  },
  toEditLyrics() {
    if (this.data.tryPlaying) {
      this.tryPlayPause();
    }
    
    if (this.data.recordState == 'recording') {
      this.endRecord();
    }

    wx.navigateTo({
      url: '/pages/create/record/lyrics/index?content=' + this.data.recordForm.lyrics
    });
  }
})