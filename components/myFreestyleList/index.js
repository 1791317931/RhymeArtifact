import TipUtil from '../../assets/js/TipUtil';
import PathUtil from '../../assets/js/PathUtil';
import * as api from '../../assets/js/api';

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    page: {
      loading: false,
      playingIndex: -1,
      playing: false,
      current_page: 1,
      per_page: 10,
      total_pages: 0,
      list: [],
      // 是否是freestyle
      isFreeStyle: false
    },
    FAC: null,
    scope: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setScope(scope) {
      this.setData({
        scope
      });
    },
    init(scope) {
      // 保持不锁屏
      wx.setKeepScreenOn({
        keepScreenOn: true
      });

      this.setScope(scope);
      let FAC = wx.createInnerAudioContext();
      this.setData({
        FAC
      });
      this.bindFACEvent();
    },
    onUnload() {
      this.data.FAC.destroy();
    },
    bindFACEvent() {
      let FAC = this.data.FAC;

      FAC.autoplay = true;
      FAC.onError((res) => {
        this.audioError();
      });

      FAC.onEnded((res) => {
        this.audioEnded();
      });
    },
    toggleItemStatus(e) {
      let index = e.currentTarget.dataset.index,
        page = this.data.page,
        playing = page.playing,
        FAC = this.data.FAC;

      if (page.playingIndex == index) {
        if (playing) {
          this.pausePlay(e);
        } else {
          this.continuePlay(e);
        }
      } else {
        this.startPlay(e);
      }
    },
    clickFsItem(e) {
      let item = this.getItem(e);
      wx.navigateTo({
        url: `/pages/freestyle/play/index?id=${item.id}&userId=${item.user_id}`
      });
    },
    deleteItem(e) {
      wx.showModal({
        title: '系统提示',
        content: '是否删除当前freestyle？',
        success: (res) => {
          if (res.confirm) {
            let item = this.getItem(e);
            api.deleteFreestyleById({
              id: item.id
            }, () => {
              TipUtil.message('操作成功');
              this.getPage(1);
            });
          }
        }
      });
    },
    startPlay(e) {
      let index = this.getIndex(e),
      item = this.getItem(e),
      FAC = this.data.FAC;

      FAC.src = PathUtil.getFilePath(item.mixture_url || item.origin_url);
      this.setData({
        'page.playingIndex': index,
        'page.playing': true
      });

      // 播放音频
      FAC.seek(0);
      FAC.play();
    },
    continuePlay(e) {
      let FAC = this.data.FAC;

      this.setData({
        'page.playing': true
      });

      // 播放音频
      FAC.play();
    },
    pausePlay(e) {
      let FAC = this.data.FAC;

      this.setData({
        'page.playing': false
      });

      FAC.pause();
    },
    audioEnded(e) {
      let FAC = this.data.FAC;

      this.setData({
        'page.playing': false
      });

      FAC.seek(0);
    },
    audioError(e) {
      if (e.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
        TipUtil.message('播放失败');
      }
      this.audioEnded(e);
    },
    onReachBottom(scope) {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
      }
    },
    getIndex(e) {
      let index = e.target.dataset.index;
      if (isNaN(index)) {
        index = e.currentTarget.dataset.index;
      }

      return parseInt(index);
    },
    getItem(e) {
      let index = this.getIndex(e);
      return this.data.page.list[index];
    },
    togglePageLoading(loading) {
      this.setData({
        'page.loading': loading
      });
    },
    getPage(current_page = 1) {
      let page = this.data.page;
      if (page.loading) {
        return;
      }

      this.pausePlay(null);
      let param = {
        page: current_page,
        per_page: page.per_page
      },
      list = [];

      if (current_page > 1) {
        list = page.list;
      }

      this.togglePageLoading(true);
      this.setData({
        'page.current_page': current_page
      });

      api.getMyFreestylePage(param, (res) => {
        let pagination = res.meta.pagination;

        res.data.forEach((item, index) => {
          list.push(item);
        });

        this.setData({
          'page.list': list,
          'page.total_pages': pagination.total_pages || 0,
          'page.current_page': pagination.current_page || 1
        });
      }, () => {
        this.togglePageLoading(false);
      });
    }
  }
})