import TipUtil from '../../../assets/js/TipUtil';
import PathUtil from '../../../assets/js/PathUtil';
import * as api from '../../../assets/js/api';
import FileType from '../../../assets/js/FileType';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import SubmittingUtil from '../../../assets/js/components/SubmittingUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scales: [],
    hideSaveModal: true,
    // 录制状态：ready（准备就绪） recording（录制中） pause（已暂停）
    recordState: 'ready',
    recordOption: {
      // 最长4分钟
      duration: 4 * 60 * 1000,
      format: 'mp3'
    },
    RM: null,
    // 伴奏音频
    BAC: null,
    // 试听音频
    TAC: null,
    // 伴奏音频路径
    beatPath: null,
    recordForm: {
      beatId: 1,
      lyrics: '小程序歌曲内容',
      duration: '',
      fileSize: 0,
      path: '',
      title: '',
      author: ''
    },
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
    submittingForm: SubmittingUtil.submittingForm
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      'recordForm.author': userInfo.nickName,
      'recordForm.beatId': options.beatId,
      beatPath: options.beatPath
    });
    console.log(options.beatId)

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
    BAC = wx.createAudioContext('beatAudio'),
    TAC = wx.createAudioContext('tryAudio');
    this.setData({
      RM,
      BAC,
      TAC
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
  changeTryPlayState(tryPlaying) {
    this.setData({
      tryPlaying
    });
  },
  tryPlayStart() {
    let recordForm = this.data.recordForm,
    TAC = this.data.TAC;

    if (recordForm.path) {
      TAC.seek(0);
      TAC.play();
      this.changeTryPlayState(true);
    } else {
      TipUtil.message('请录制完成后再试听');
    }
  },
  tryPlayPause() {
    let recordForm = this.data.recordForm,
    TAC = this.data.TAC;

    TAC.pause();
    this.changeTryPlayState(false);
  },
  changeRecordState(recordState) {
    this.setData({
      recordState
    });
  },
  beginRecord() {
    let RM = this.data.RM,
    BAC = this.data.BAC;

    if (this.data.tryPlaying) {
      TipUtil.message('您正在试听，请关闭后再操作');
      return;
    }

    RM.start(this.data.recordOption);
    RM.onStart(() => {
      if (this.data.recordState == 'ready') {
        // 从头播放
        BAC.seek(0);
      }
      BAC.play();

      this.changeRecordState('recording');
      TipUtil.message('录制中');
    });
  },
  pauseRecord() {
    let RM = this.data.RM,
    BAC = this.data.BAC;

    RM.pause();
    RM.onPause(() => {
      BAC.pause();
      if (this.data.recordState != 'pause') {
        this.changeRecordState('pause');
        TipUtil.message('已暂停录制');
      }
    });
  },
  saveRecord() {
    // 正在录制或者暂停
    if (this.data.recordState == 'ready') {
      TipUtil.message('您还没有录制');
      return;
    }

    // 先暂停录制
    this.pauseRecord();
    this.toggleSaveModal(false);
  },
  beatAudioEnded() {
    this.changeTryPlayState(false);
  },
  beatAudioError(e) {
    console.log(e)
    this.changeTryPlayState(false);
  },
  beatAudioTimeUpdate(e) {
    console.log(e);
  },
  bindplay() {
    
  },
  tryAudioEnded() {
    this.changeTryPlayState(false);
  },
  tryAudioError(e) {
    console.log(e)
    this.changeTryPlayState(false);
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
  submitRecord() {
    let RM = this.data.RM;
    // 先结束录制，并且保存音频
    RM.stop();
    RM.onStop((res) => {
      let recordForm = this.data.recordForm;
      recordForm.duration = res.duration;
      recordForm.fileSize = res.fileSize;
      recordForm.path = res.tempFilePath;
      this.setData({
        recordForm
      });

      this.uploadRecordAndSubmit();
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

    SubmittingUtil.toggleSubmitting(true, this);
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
            SubmittingUtil.toggleSubmitting(false, this);
            if (ConfigUtil.isSuccess(res.code)) {
              TipUtil.message('上传成功');
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
        TipUtil.message('上传失败');
        SubmittingUtil.toggleSubmitting(false, this);
      }
    });
  },
  toEditLyrics() {
    wx.navigateTo({
      url: '/pages/create/record/lyrics/index?content=' + this.data.recordForm.lyrics
    });
  }
})