import TipUtil from '../TipUtil';
import ConfigUtil from '../ConfigUtil';
import PathUtil from '../PathUtil';
import * as api from '../api';

let BeatListUtil = {
  beatPage: {
    loading: false,
    page: 1,
    pageSize: 10,
    totalPage: 0,
    pageNum: 1,
    list: []
  },
  toggleBeatItemStatus(e, _this) {
    let index = e.currentTarget.dataset.index;
    _this.setData({
      [`beatPage.list[${index}].playing`]: !_this.data.beatPage.list[index].playing
    });
  },
  clickCollectionItem(e, _this) {
    let index = e.currentTarget.dataset.index;
  },
  toRecord(e, _this) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/create/record/index'
    });
  },
  onReachBottom(_this) {
    let page = _this.data.beatPage;
    if (page.pageNum < page.totalPage) {
      _this.getBeatPage();
    }
  },
  getItem(e, _this) {
    let index = e.target.dataset.index;
    if (isNaN(index)) {
      index = e.currentTarget.dataset.index;
    }

    return _this.data.beatPage.list[index];
  },
  toggleBeatPageLoading(loading, _this) {
    _this.setData({
      'beatPage.loading': loading
    });
  },
  getBeatPage(pageNum = 1, _this) {
    let page = _this.data.beatPage;
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

    BeatListUtil.toggleBeatPageLoading(true, _this);
    _this.setData({
      'beatPage.page': pageNum
    });

    api.getBeatPage(param, (res) => {
      console.log(res);
      if (ConfigUtil.isSuccess(res.code)) {
        let obj = res.data;
        obj.data.forEach((item, index) => {
          item.mixture_url = PathUtil.getFilePath(item.mixture_url);


          list.push(item);
        });

        _this.setData({
          'beatPage.list': list,
          'beatPage.totalPage': obj.maxPage || 0,
          'beatPage.pageNum': obj.page || 1
        });
      } else {
        TipUtil.errorCode(res.code);
      }
    }, () => {
      BeatListUtil.toggleBeatPageLoading(false, _this);
    });
  }
};

export default BeatListUtil;