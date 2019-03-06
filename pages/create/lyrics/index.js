import CommonUtil from '../../../assets/js/CommonUtil';
import TipUtil from '../../../assets/js/TipUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import * as api from '../../../assets/js/api';
import SearchLyricUtil from '../../../assets/js/components/SearchLyricUtil';
import SubmittingUtil from '../../../assets/js/components/SubmittingUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    lyricsForm: {
      lyric_id: null,
      lyric_title: '',
      lyric_content: ''
    },
    lyricsRule: {
      title: {
        length: 30
      },
      content: {
        length: 1000
      }
    },
    // create创建   search搜索
    mode: 'create',
    rhymePage: CommonUtil.copyObject(SearchLyricUtil.rhymePage),
    submittingForm: SubmittingUtil.submittingForm,
    showSubmit: true,
    readonly: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.readonly == 'Y') {
      this.setData({
        readonly: true
      });
    }

    if (options.id) {
      this.setData({
        'lyricsForm.lyric_id': options.id
      });
      this.getLyricById();
    }
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
    
  },
  getLyricById() {
    let lyric_id = this.data.lyricsForm.lyric_id;
    api.getLyricById({
      lyric_id
    }, (res) => {
      if (ConfigUtil.isSuccess(res.code)) {
        this.setData({
          lyricsForm: res.data
        });
      } else {
        TipUtil.errorCode(res.code);
      }
    });
  },
  changeTitle(e) {
    let title = e.detail.value;
    this.setData({
      'lyricsForm.title': title
    });
  },
  changeKeyword(e) {
    SearchLyricUtil.changeKeyword(e, this);
  },
  toggleMortgage(e) {
    SearchLyricUtil.toggleMortgage(e, this);
  },
  getRhymeList() {
    SearchLyricUtil.getRhymeList(this);
  },
  openSearch() {
    this.setData({
      mode: 'search'
    });
  },
  closeSearch() {
    this.setData({
      mode: 'create'
    });
  },
  changeTitle(e) {
    this.setData({
      'lyricsForm.lyric_title': e.detail.value.trim()
    });
  },
  changeContent(e) {
    this.setData({
      'lyricsForm.lyric_content': e.detail.value.trim()
    });
  },
  save() {
    if (!this.data.showSubmit) {
      return;
    }

    let form = this.data.lyricsForm;
    if (!form.lyric_title.length) {
      TipUtil.message('请填写标题');
      return;
    }

    if (!form.lyric_content.length) {
      TipUtil.message('请填写歌词内容');
      return;
    }

    SubmittingUtil.toggleSubmitting(true, this);
    if (!form.lyric_id) {
      api.createLyric(form, (res) => {
        this.editLyricCallback(res);
      }, () => {
        SubmittingUtil.toggleSubmitting(false, this);
      });
    } else {
      let obj = {
        ...form,
        id: form.lyric_id
      };
      api.updateLyricById(obj, (res) => {
        this.editLyricCallback(res);
      }, () => {
        SubmittingUtil.toggleSubmitting(false, this);
      });
    }
  },
  editLyricCallback(res) {
    if (ConfigUtil.isSuccess(res.code)) {
      this.setData({
        showSubmit: false
      });
      TipUtil.message('操作成功');
      setTimeout(() => {
        wx.navigateBack({

        });
      }, 1500);
    } else {
      TipUtil.error(res.info);
    }
  }
})