import TipUtil from '../TipUtil';
import ConfigUtil from '../ConfigUtil';
import * as api from '../api';
import CommonUtil from '../CommonUtil';

let LyricListUtil = {
  lyricsPage: {
    loading: false,
    current_page: 1,
    per_page: 10,
    total_pages: 0,
    list: []
  },
  onReachBottom(_this) {
    let page = _this.data.lyricsPage;
    if (page.current_page < page.total_pages) {
      LyricListUtil.getLyricPage(page.current_page + 1, _this);
    }
  },
  clickLyricItem(e, _this) {
    let item = LyricListUtil.getItem(e, _this);
    wx.navigateTo({
      url: '/pages/create/lyrics/index?id=' + item.id
    });
  },
  shareLyric(e, _this) {
    if (e.from == 'button') {
      let item = LyricListUtil.getItem(e, _this);

      let random = CommonUtil.getShareRandom();
      return {
        title: CommonUtil.shareRandomMsgs[random],
        imageUrl: CommonUtil.getShareImage(random),
        path: '/pages/main/index?lyricId=' + item.id,
        success: (res) => {
          
        },
        fail(res) {

        },
        complete(res) {

        }
      };
    }
  },
  toDeleteLyricItem(e, _this) {
    let item = LyricListUtil.getItem(e, _this);
    wx.showModal({
      title: '系统提示',
      content: '确认要删除该数据吗？',
      success(e) {
        if (e.confirm) {
          api.deleteLyricById({
            lyric_id: item.id
          }, (res) => {
            TipUtil.message('操作成功');
            LyricListUtil.getLyricPage(1, _this);
          });
        }
      }
    });
  },
  getItem(e, _this) {
    let index = LyricListUtil.getIndex(e, _this);

    return _this.data.lyricsPage.list[index];
  },
  getIndex(e, _this) {
    let index = e.target.dataset.index;
    if (isNaN(index)) {
      index = e.currentTarget.dataset.index;
    }

    return parseInt(index);
  },
  toggleLyricPageLoading(loading, _this) {
    _this.setData({
      'lyricsPage.loading': loading
    });
  },
  getLyricPage(current_page = 1, _this) {
    let page = _this.data.lyricsPage;
    if (page.loading) {
      return;
    }

    let param = {
      page: current_page,
      per_page: page.per_page,
      include: 'user'
    },
    list = [];

    if (current_page > 1) {
      list = page.list;
    }

    LyricListUtil.toggleLyricPageLoading(true, _this);
    _this.setData({
      'lyricsPage.current_page': current_page
    });

    api.getLyricPage(param, (res) => {
      let pagination = res.meta.pagination;

      res.data.forEach((item, index) => {
        list.push(item);
      });

      _this.setData({
        'lyricsPage.list': list,
        'lyricsPage.total_pages': pagination.page || 0,
        'lyricsPage.current_page': pagination.page || 1
      });
    }, () => {
      LyricListUtil.toggleLyricPageLoading(false, _this);
    });
  }
};

export default LyricListUtil;