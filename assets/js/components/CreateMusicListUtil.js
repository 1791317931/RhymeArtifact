import TipUtil from '../TipUtil';
import ConfigUtil from '../ConfigUtil';
import PathUtil from '../PathUtil';
import * as api from '../api';

let CreateMusicListUtil = {
  createMusicPage: {
    loading: false,
    playingIndex: -1,
    page: 1,
    pageSize: 10,
    totalPage: 0,
    pageNum: 1,
    list: []
  },
  init(_this) {
    let TAC = wx.createAudioContext('musicAudio');
    _this.setData({
      TAC
    });
  },
  toggleMusicItemStatus(e, _this) {
    let index = e.currentTarget.dataset.index,
    TAC = _this.data.TAC;

    if (_this.data.createMusicPage.playingIndex == index) {
      index = -1;
      // 结束音频
      TAC.pause();
    } else {
      // 播放音频
      TAC.seek(0);
      TAC.play();
    }

    _this.setData({
      'createMusicPage.playingIndex': index
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
    let page = _this.data.createMusicPage;
    if (page.pageNum < page.totalPage) {
      _this.getMusicPage();
    }
  },
  getItem(e, _this) {
    let index = e.target.dataset.index;
    if (isNaN(index)) {
      index = e.currentTarget.dataset.index;
    }

    return _this.data.createMusicPage.list[index];
  },
  toggleMusicPageLoading(loading, _this) {
    _this.setData({
      'createMusicPage.loading': loading
    });
  },
  getMusicPage(pageNum = 1, _this) {
    let page = _this.data.createMusicPage;
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

    CreateMusicListUtil.toggleMusicPageLoading(true, _this);
    _this.setData({
      'createMusicPage.page': pageNum
    });

    api.getMusicPage(param, (res) => {
      if (ConfigUtil.isSuccess(res.code)) {
        let obj = res.data;
        obj.data.forEach((item, index) => {
          item.mixture_url = PathUtil.getFilePath(item.mixture_url) || '/assets/imgs/logo.png';
          item.collection_num = parseInt(item.collection_num);
          item.share_num = parseInt(item.share_num);
          list.push(item);
        });

        _this.setData({
          'createMusicPage.list': list,
          'createMusicPage.totalPage': obj.maxPage || 0,
          'createMusicPage.pageNum': obj.page || 1
        });
      } else {
        TipUtil.errorCode(res.code);
      }
    }, () => {
      CreateMusicListUtil.toggleMusicPageLoading(false, _this);
    });
  },
  collectItem(e, _this) {
    
  }
};

export default CreateMusicListUtil;