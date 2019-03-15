import TipUtil from '../TipUtil';
import ConfigUtil from '../ConfigUtil';
import * as api from '../api';
import CommonUtil from '../CommonUtil';

let LyricListUtil = {
  lyricsPage: {
    loading: false,
    page: 1,
    pageSize: 10,
    totalPage: 0,
    pageNum: 1,
    list: []
  },
  onReachBottom(_this) {
    let page = _this.data.lyricsPage;
    if (page.pageNum < page.totalPage) {
      _this.getLyricPage(page.pageNum + 1);
    }
  },
  clickLyricItem(e, _this) {
    let item = LyricListUtil.getItem(e, _this);
    wx.navigateTo({
      url: '/pages/create/lyrics/index?id=' + item.lyric_id
    });
  },
  shareLyric(e, _this) {
    if (e.from == 'button') {
      let item = LyricListUtil.getItem(e, _this);

      let random = CommonUtil.getShareRandom();
      return {
        title: CommonUtil.shareRandomMsgs[random],
        imageUrl: CommonUtil.getShareImage(random),
        path: '/pages/main/index?lyricId=' + item.lyric_id,
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
            lyric_id: item.lyric_id
          }, (res) => {
            if (ConfigUtil.isSuccess(res.code)) {
              TipUtil.message('操作成功');
              LyricListUtil.getLyricPage(1, _this);
            } else {
              TipUtil.error(res.info);
            }
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
  getLyricPage(pageNum = 1, _this) {
    let page = _this.data.lyricsPage;
    if (page.loading) {
      return;
    }

    let param = {
      page: pageNum,
      pageSize: page.pageSize
    },
      list = [];

    if (pageNum > 1) {
      list = page.list;
    }

    LyricListUtil.toggleLyricPageLoading(true, _this);
    _this.setData({
      'lyricsPage.page': pageNum
    });

    api.getLyricPage(param, (res) => {
      if (ConfigUtil.isSuccess(res.code)) {
        let obj = res.data;
        obj.data.forEach((item, index) => {
          list.push(item);
        });

        _this.setData({
          'lyricsPage.list': list,
          'lyricsPage.totalPage': parseInt(obj.maxPage || 0),
          'lyricsPage.pageNum': parseInt(obj.page || 1)
        });
      } else {
        TipUtil.errorCode(res.code);
      }
    }, () => {
      LyricListUtil.toggleLyricPageLoading(false, _this);
    });
  }
};

export default LyricListUtil;