import CommonUtil from '../../../assets/js/CommonUtil';
import TipUtil from '../../../assets/js/TipUtil';
import * as api from '../../../assets/js/api';

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
    submitting: true,
    readonly: false,
    loadModalComponent: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent');
    loadModalComponent.init(this);
    this.setData({
      loadModalComponent
    });

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
    if (e.from == 'menu') {
      return CommonUtil.share(e);
    }
  },
  getLyricById() {
    let loadModalComponent = this.data.loadModalComponent;
    loadModalComponent.toggleLoading(true);

    let lyric_id = this.data.lyricsForm.lyric_id;
    api.getLyricById({
      lyric_id,
      include: 'user'
    }, (res) => {
      this.setData({
        lyricsForm: res.data
      });
    }, () => {
      loadModalComponent.toggleLoading(false);
    });
  },
  changeTitle(e) {
    let title = e.detail.value;
    this.setData({
      'lyricsForm.title': title
    });
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
  save(e) {
    let loadModalComponent = this.data.loadModalComponent;
    if (loadModalComponent.isLoading()) {
      return;
    }

    let form = this.data.lyricsForm;
    let title = e.detail.value.title.trim()
    let content = e.detail.value.content.trim()
    if (!title.length) {
      TipUtil.message('请填写标题');
      return;
    }

    if (!content.length) {
      TipUtil.message('请填写歌词内容');
      return;
    }

    loadModalComponent.toggleLoading(true);
    if (!form.id) {
      let obj = {
        lyric_title: title,
        lyric_content: content
      }
      api.createLyric(obj, (res) => {
        this.editLyricCallback(res);
      }, () => {
        loadModalComponent.toggleLoading(false);
      });
    } else {
      let obj = {
        lyric_title: title,
        lyric_content: content,
        id: form.id
      };
      api.updateLyricById(obj, (res) => {
        this.editLyricCallback(res);
      }, () => {
        loadModalComponent.toggleLoading(false);
      });
    }
  },
  editLyricCallback(res) {
    TipUtil.message('操作成功');
    setTimeout(() => {
      let pages = getCurrentPages()
      pages[pages.length - 2].init()
      wx.navigateBack({

      });
    }, 1500);
  }
})