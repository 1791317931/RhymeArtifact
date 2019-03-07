import TipUtil from '../TipUtil';
import ConfigUtil from '../ConfigUtil';
import PathUtil from '../PathUtil';
import TimeUtil from '../TimeUtil';
import * as api from '../api';

let BeatListUtil = {
  beatPage: {
    loading: false,
    playingIndex: -1,
    playing: false,
    page: 1,
    pageSize: 10,
    totalPage: 0,
    pageNum: 1,
    list: []
  },
  init(_this) {
    let BAC = wx.createAudioContext('beatAudio');
    _this.setData({
      BAC
    });
  },
  toggleBeatItemStatus(e, _this) {
    let index = e.currentTarget.dataset.index,
    page = _this.data.beatPage,
    playing = page.playing,
    BAC = _this.data.BAC;

    if (page.playingIndex == index) {
      if (playing) {
        BeatListUtil.pausePlay(e, _this);
      } else {
        BeatListUtil.continuePlay(e, _this);
      }
    } else {
      BeatListUtil.startPlay(e, _this);
    }
  },
  toggleBeatCollectionItem(e, _this) {
    let item = BeatListUtil.getItem(e, _this),
    index = BeatListUtil.getIndex(e, _this),
    beatPage = _this.data.beatPage;

    if (item.is_collection == 1 || beatPage.showMine) {
      api.deleteBeat({
        id: item.beat_id
      }, (res) => {
        if (ConfigUtil.isSuccess(res.code)) {
          TipUtil.message('已取消收藏');

          // 显示我的收藏，把被取消收藏的伴奏去掉
          if (beatPage.showMine) {
            let list = beatPage.list;
            list.splice(index, 1);

            _this.setData({
              'beatPage.list': list
            });
          } else {
            item.is_collection = '0';

            _this.setData({
              [`beatPage.list[${index}]`]: item
            });
          }
        } else {
          TipUtil.message(res.info);
        }
      });
    } else {
      api.collectBeat({
        id: item.beat_id
      }, (res) => {
        if (ConfigUtil.isSuccess(res.code)) {
          TipUtil.message('收藏成功');
          item.is_collection = '1';

          _this.setData({
            [`beatPage.list[${index}]`]: item
          });
        } else {
          TipUtil.message(res.info);
        }
      });
    }
  },
  startPlay(e, _this) {
    let index = BeatListUtil.getIndex(e, _this),
    BAC = _this.data.BAC;

    _this.setData({
      'beatPage.playingIndex': index,
      'beatPage.playing': true
    });

    // 播放音频
    BAC.seek(0);
    BAC.play();
  },
  continuePlay(e, _this) {
    let BAC = _this.data.BAC;

    _this.setData({
      'beatPage.playing': true
    });

    // 播放音频
    BAC.play();
  },
  pausePlay(e, _this) {
    let BAC = _this.data.BAC;

    _this.setData({
      'beatPage.playing': false
    });

    BAC.pause();
  },
  beatPlayEnd(e, _this) {
    let BAC = _this.data.BAC;

    _this.setData({
      'beatPage.playing': false
    });

    BAC.seek(0);
  },
  beatLoadError(e, _this) {
    if (e.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
      TipUtil.message('播放失败');
    }
    BeatListUtil.playEnd(e, _this);
  },
  toRecord(e, _this) {
    BeatListUtil.pausePlay(e, _this);

    let item = BeatListUtil.getItem(e, _this);
    wx.navigateTo({
      url: '/pages/create/record/index?beatItem=' + JSON.stringify(item)
    });
  },
  onReachBottom(_this) {
    let page = _this.data.beatPage;
    if (page.pageNum < page.totalPage) {
      BeatListUtil.getBeatPage(page.pageNum + 1, _this);
    }
  },
  getIndex(e, _this) {
    let index = e.target.dataset.index;
    if (isNaN(index)) {
      index = e.currentTarget.dataset.index;
    }

    return index;
  },
  getItem(e, _this) {
    let index = BeatListUtil.getIndex(e, _this);
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

    BeatListUtil.pausePlay(null, _this);
    let param = {
      page: pageNum,
      pageSize: page.pageSize,
      type: 'beat'
    },
    list = [];

    if (pageNum > 1) {
      list = page.list;
    }

    BeatListUtil.toggleBeatPageLoading(true, _this);
    _this.setData({
      'beatPage.page': pageNum
    });

    let fn;
    if (_this.data.beatPage.showMine) {
      fn = api.getCollection;
    } else {
      fn = api.getBeatPage;
    }

    fn(param, (res) => {
      if (ConfigUtil.isSuccess(res.code)) {
        let obj = res.data;
        obj.data.forEach((item, index) => {
          item.beat_url = PathUtil.getFilePath(item.beat_url);

          // 总时长
          let totalTime = TimeUtil.stringToNumber(item.beat_time);
          item.totalTime = totalTime;
          // 剩余时长
          item.surplusTime = totalTime;

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