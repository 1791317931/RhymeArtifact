import TipUtil from '../TipUtil';
import ConfigUtil from '../ConfigUtil';
import PathUtil from '../PathUtil';
import TimeUtil from '../TimeUtil';
import * as api from '../api';

let CreateMusicListUtil = {
  createMusicPage: {
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
    let MAC = wx.createAudioContext('musicAudio');
    _this.setData({
      MAC
    });
  },
  toggleMusicItemStatus(e, _this) {
    let index = e.currentTarget.dataset.index,
    page = _this.data.createMusicPage,
    playing = page.playing,
    MAC = _this.data.MAC;

    if (page.playingIndex == index) {
      if (playing) {
        CreateMusicListUtil.pausePlay(e, _this);
      } else {
        CreateMusicListUtil.continuePlay(e, _this);
      }
    } else {
      CreateMusicListUtil.startPlay(e, _this);
    }
  },
  clickCollectionItem(e, _this) {
    let index = e.currentTarget.dataset.index;
  },
  onReachBottom(_this) {
    let page = _this.data.createMusicPage;
    if (page.pageNum < page.totalPage) {
      CreateMusicListUtil.getMusicPage(page.pageNum + 1, _this);
    }
  },
  startPlay(e, _this) {
    let index = CreateMusicListUtil.getIndex(e, _this),
    MAC = _this.data.MAC;

    _this.setData({
      'createMusicPage.playingIndex': index,
      'createMusicPage.playing': true
    });

    // 播放音频
    MAC.seek(0);
    MAC.play();
  },
  continuePlay(e, _this) {
    let MAC = _this.data.MAC;

    _this.setData({
      'createMusicPage.playing': true
    });

    // 播放音频
    MAC.play();
  },
  pausePlay(e, _this) {
    let MAC = _this.data.MAC;

    _this.setData({
      'createMusicPage.playing': false
    });

    MAC.pause();
  },
  musicPlayEnd(e, _this) {
    let MAC = _this.data.MAC;

    _this.setData({
      'createMusicPage.playing': false
    });

    MAC.seek(0);
  },
  musicLoadError(e, _this) {
    if (e.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
      TipUtil.message('播放失败');
    }
    CreateMusicListUtil.musicPlayEnd(e, _this);
  },
  musicAudioTimeUpdate(e, _this) {
    let time = e.detail.currentTime,
    totalTime = e.detail.duration;

    CreateMusicListUtil.caculateSurplusTime(totalTime, time, _this);
  },
  // 计算剩余时间
  caculateSurplusTime(totalTime, currentTime, _this) {
    let surplusTime = parseInt(totalTime - currentTime),
    playingIndex = _this.data.createMusicPage.playingIndex,
    item = _this.data.createMusicPage.list[playingIndex];

    item.surplusTime = surplusTime;
    item.surplusTimeArr = TimeUtil.numberToArr(surplusTime);

    _this.setData({
      [`createMusicPage.list[${playingIndex}]`]: item
    });
  },
  getIndex(e, _this) {
    let index = e.target.dataset.index;
    if (isNaN(index)) {
      index = e.currentTarget.dataset.index;
    }

    return index;
  },
  getItem(e, _this) {
    let index = CreateMusicListUtil.getIndex(e, _this);
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

    CreateMusicListUtil.pausePlay(null, _this);
    let param = {
      page: pageNum,
      pageSize: page.pageSize,
      type: 'music'
    },
      list = [];

    if (pageNum > 1) {
      list = page.list;
    }

    CreateMusicListUtil.toggleMusicPageLoading(true, _this);
    _this.setData({
      'createMusicPage.page': pageNum
    });

    let fn;
    if (_this.data.createMusicPage.showMine) {
      fn = api.getCollection;
    } else {
      fn = api.getMusicPage;
    }

    fn(param, (res) => {
      if (ConfigUtil.isSuccess(res.code)) {
        let obj = res.data;
        obj.data.forEach((item, index) => {
          item.mixture_url = PathUtil.getFilePath(item.mixture_url) || '/assets/imgs/logo.png';
          item.collection_num = parseInt(item.collection_num);
          item.share_num = parseInt(item.share_num);

          // 总时长
          let totalTime = parseInt(parseInt(item.music_duration) / 1000);
          item.totalTime = totalTime;
          // 剩余时长
          item.surplusTime = totalTime;
          item.surplusTimeArr = TimeUtil.numberToArr(totalTime);

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
  toggleMusicCollectItem(e, _this) {
    let item = CreateMusicListUtil.getItem(e, _this),
    index = CreateMusicListUtil.getIndex(e, _this),
    createMusicPage = _this.data.createMusicPage;

    if (item.is_collection == 1 || createMusicPage.showMine) {
      api.deleteMusic({
        id: item.id
      }, (res) => {
        if (ConfigUtil.isSuccess(res.code)) {
          TipUtil.message('已取消收藏');

          // 显示我的收藏，把被取消收藏的创作去掉
          if (_this.data.createMusicPage.showMine) {
            let list = createMusicPage.list;
            list.splice(index, 1);

            _this.setData({
              'createMusicPage.list': list
            });
          } else {
            item.collection_num = item.collection_num - 1;
            item.is_collection = '0';

            _this.setData({
              [`createMusicPage.list[${index}]`]: item
            });
          }
        } else {
          TipUtil.message(res.info);
        }
      });
    } else {
      api.collectMusic({
        id: item.id
      }, (res) => {
        if (ConfigUtil.isSuccess(res.code)) {
          TipUtil.message('收藏成功');
          item.collection_num = item.collection_num + 1;
          item.is_collection = '1';

          _this.setData({
            [`createMusicPage.list[${index}]`]: item
          });
        } else {
          TipUtil.message(res.info);
        }
      });
    }
  },
  shareItem(e, _this) {
    if (e.from == 'button') {
      let item = CreateMusicListUtil.getItem(e, _this),
      index = CreateMusicListUtil.getIndex(e, _this);

      api.shareMusic({
        id: item.id
      }, (res) => {
        if (ConfigUtil.isSuccess(res.code)) {
          item.share_num = item.share_num + 1;
          _this.setData({
            [`createMusicPage.list[${index}]`]: item
          });
        } else {
          TipUtil.error(res.info);
        }
      });

      return {
        title: item.lyric_title,
        path: '/pages/main/index',
        success: (res) => {
          
        },
        fail(res) {

        },
        complete(res) {

        }
      };
    }
  }
};

export default CreateMusicListUtil;