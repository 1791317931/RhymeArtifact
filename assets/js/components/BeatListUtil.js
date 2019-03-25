import TipUtil from '../TipUtil';
import CommonUtil from '../CommonUtil';
import ConfigUtil from '../ConfigUtil';
import PathUtil from '../PathUtil';
import TimeUtil from '../TimeUtil';
import DownloadUtil from '../DownloadUtil';
import PosterCanvasUtil from './PosterCanvasUtil';
import * as api from '../api';

let BeatListUtil = {
  beatPage: {
    loading: false,
    playingIndex: -1,
    playing: false,
    current_page: 1,
    per_page: 10,
    total_pages: 0,
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

    if (item.is_collection == 1 || beatPage.showCollection) {
      api.deleteBeat({
        id: item.beat_id
      }, (res) => {
        if (ConfigUtil.isSuccess(res.code)) {
          TipUtil.message('已取消收藏');

          // 显示我的收藏，把被取消收藏的伴奏去掉
          if (beatPage.showCollection) {
            let list = beatPage.list;
            list.splice(index, 1);

            _this.setData({
              'beatPage.list': list
            });
          } else {
            item.is_collection = '0';
            item.collection_num -= 1;

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
          item.collection_num += 1;

          _this.setData({
            [`beatPage.list[${index}]`]: item
          });
        } else {
          TipUtil.message(res.info);
        }
      });
    }
  },
  shareBeatItem(e, _this) {
    let random = CommonUtil.getShareRandom();

    return {
      title: CommonUtil.shareRandomMsgs[random],
      imageUrl: CommonUtil.getShareImage(random),
      path: '/pages/main/index',
      success: (res) => {

      },
      fail(res) {

      },
      complete(res) {

      }
    };
  },
  // 下载海报
  generatePoster(e, _this) {
    let item = BeatListUtil.getItem(e, _this);
    PosterCanvasUtil.draw(_this, item, 'beat');
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
    BeatListUtil.beatPlayEnd(e, _this);
  },
  beatAudioTimeUpdate(e, _this) {
    let time = e.detail.currentTime,
    totalTime = e.detail.duration;

    BeatListUtil.caculateSurplusTime(totalTime, time, _this);
  },
  // 计算剩余时间
  caculateSurplusTime(totalTime, currentTime, _this) {
    let surplusTime = parseInt(totalTime - currentTime),
    playingIndex = _this.data.beatPage.playingIndex,
    item = _this.data.beatPage.list[playingIndex];

    item.surplusTime = surplusTime;
    item.surplusTimeArr = TimeUtil.numberToArr(surplusTime);

    _this.setData({
      [`beatPage.list[${playingIndex}]`]: item
    });
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
    if (page.current_page < page.total_pages) {
      BeatListUtil.getBeatPage(page.current_page + 1, _this);
    }
  },
  getIndex(e, _this) {
    let index = e.target.dataset.index;
    if (isNaN(index)) {
      index = e.currentTarget.dataset.index;
    }

    return parseInt(index);
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
  getBeatPage(current_page = 1, _this) {
    let page = _this.data.beatPage;
    if (page.loading) {
      return;
    }

    BeatListUtil.pausePlay(null, _this);
    let param = {
      current_page,
      per_page: page.per_page
    },
    list = [];

    if (current_page > 1) {
      list = page.list;
    }

    BeatListUtil.toggleBeatPageLoading(true, _this);
    _this.setData({
      'beatPage.current_page': current_page
    });

    let fn;
    if (_this.data.beatPage.showCollection) {
      fn = api.getCollection;

      param.type = 'beat';
    } else {
      fn = api.getBeatPage;
    }

    fn(param, (res) => {
      if (ConfigUtil.isSuccess(res.code)) {
        let obj = res.data;
        obj.data.forEach((item, index) => {
          item.beat_url = PathUtil.getFilePath(item.beat_url);
          item.collection_num = parseInt(item.collection_num);

          // 总时长
          let totalTime = TimeUtil.stringToNumber(item.beat_time);
          item.totalTime = totalTime;
          // 剩余时长
          item.surplusTime = totalTime;
          item.surplusTimeArr = TimeUtil.numberToArr(totalTime);

          list.push(item);
        });

        _this.setData({
          'beatPage.list': list,
          'beatPage.total_pages': parseInt(obj.total_pages || 0),
          'beatPage.current_page': parseInt(obj.current_page || 1)
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