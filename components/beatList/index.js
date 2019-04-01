import TipUtil from '../../assets/js/TipUtil';
import CommonUtil from '../../assets/js/CommonUtil';
import ConfigUtil from '../../assets/js/ConfigUtil';
import PathUtil from '../../assets/js/PathUtil';
import TimeUtil from '../../assets/js/TimeUtil';
import PosterCanvasUtil from '../../assets/js/components/PosterCanvasUtil';
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
    beatPage: {
      loading: false,
      playingIndex: -1,
      playing: false,
      current_page: 1,
      per_page: 10,
      total_pages: 0,
      list: []
    },
    BAC: null,
    scope: null,
    posterUrl: null
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
      this.setScope(scope);
      let BAC = wx.createInnerAudioContext();
      this.setData({
        BAC
      });
      this.bindBACEvent();
      this.getBeatPage(1);
    },
    onUnload() {
      this.data.BAC.destroy();
    },
    bindBACEvent() {
      let BAC = this.data.BAC;
      
      BAC.autoplay = true;
      BAC.onTimeUpdate(() => {
        this.beatAudioTimeUpdate(BAC.duration, BAC.currentTime);
      });

      BAC.onError((res) => {
        this.beatAudioError();
      });

      BAC.onEnded((res) => {
        this.beatAudioEnded();
      });
    },
    toggleBeatItemStatus(e) {
      let index = e.currentTarget.dataset.index,
        page = this.data.beatPage,
        playing = page.playing,
        BAC = this.data.BAC;

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
    toggleBeatCollectionItem(e) {
      let item = this.getItem(e),
        index = this.getIndex(e),
        beatPage = this.data.beatPage,
        type = 'beat';

      if (item.isCollection || beatPage.showCollection) {
        api.deleteCollection({
          id: item.id,
          type
        }, (res) => {
          TipUtil.message('已取消收藏');

          // 显示我的收藏，把被取消收藏的伴奏去掉
          if (beatPage.showCollection) {
            let list = beatPage.list;
            list.splice(index, 1);

            this.setData({
              'beatPage.list': list
            });
          } else {
            item.isCollection = false;
            item.collection_num--;

            this.setData({
              [`beatPage.list[${index}]`]: item
            });
          }
        });
      } else {
        api.addCollection({
          id: item.id,
          type
        }, (res) => {
          TipUtil.message('收藏成功');
          item.isCollection = true;
          item.collection_num++;

          this.setData({
            [`beatPage.list[${index}]`]: item
          });
        });
      }
    },
    shareBeatItem(e) {
      let random = CommonUtil.getShareRandom();

      return {
        title: CommonUtil.shareRandomMsgs[random],
        imageUrl: CommonUtil.getShareImage(random),
        path: '/pages/create/beatList/index',
        success: (res) => {

        },
        fail(res) {

        },
        complete(res) {

        }
      };
    },
    // 下载海报
    generatePoster(e) {
      let item = this.getItem(e);
      PosterCanvasUtil.draw(this.data.scope, item, 'beat');
    },
    startPlay(e) {
      let index = this.getIndex(e),
        BAC = this.data.BAC;

      BAC.src = this.getItem(e).beat_url;
      this.setData({
        'beatPage.playingIndex': index,
        'beatPage.playing': true
      });

      // 播放音频
      BAC.seek(0);
      BAC.play();
    },
    continuePlay(e) {
      let BAC = this.data.BAC;

      this.setData({
        'beatPage.playing': true
      });

      // 播放音频
      BAC.play();
    },
    pausePlay(e) {
      let BAC = this.data.BAC;

      this.setData({
        'beatPage.playing': false
      });

      BAC.pause();
    },
    beatAudioEnded(e) {
      let BAC = this.data.BAC;

      this.setData({
        'beatPage.playing': false
      });

      BAC.seek(0);
    },
    beatAudioError(e) {
      if (e.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
        TipUtil.message('播放失败');
      }
      this.beatPlayEnd(e);
    },
    beatAudioTimeUpdate(totalTime, time) {
      this.caculateSurplusTime(totalTime, time);
    },
    // 计算剩余时间
    caculateSurplusTime(totalTime, currentTime) {
      let surplusTime = parseInt(totalTime - currentTime),
        playingIndex = this.data.beatPage.playingIndex,
        item = this.data.beatPage.list[playingIndex];

      item.surplusTime = surplusTime;
      item.surplusTimeArr = TimeUtil.numberToArr(surplusTime);

      this.setData({
        [`beatPage.list[${playingIndex}]`]: item
      });
    },
    toRecord(e) {
      this.pausePlay(e);

      let item = this.getItem(e);
      wx.navigateTo({
        url: '/pages/create/record/index?beatItem=' + JSON.stringify(item)
      });
    },
    onReachBottom(scope) {
      let page = this.data.beatPage;
      if (page.current_page < page.total_pages) {
        this.getBeatPage(page.current_page + 1);
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
      return this.data.beatPage.list[index];
    },
    toggleBeatPageLoading(loading) {
      this.setData({
        'beatPage.loading': loading
      });
    },
    getBeatPage(current_page = 1) {
      let page = this.data.beatPage;
      if (page.loading) {
        return;
      }

      this.pausePlay(null);
      let param = {
        page: current_page,
        per_page: page.per_page,
        hasCollection: 1
      },
        list = [];

      if (current_page > 1) {
        list = page.list;
      }

      this.toggleBeatPageLoading(true);
      this.setData({
        'beatPage.current_page': current_page
      });

      let fn;
      if (this.data.beatPage.showCollection) {
        fn = api.getCollection;

        param.type = 'beat';
      } else {
        fn = api.getBeatPage;
      }

      fn(param, (res) => {
        let pagination = res.meta.pagination;

        res.data.forEach((item, index) => {
          item.beat_url = PathUtil.getFilePath(item.beat_url);
          item.collection_num = parseInt(item.collection_num);

          // 总时长
          let totalTime = Math.ceil(item.beat_duration / 1000);
          item.totalTime = totalTime;
          // 剩余时长
          item.surplusTime = totalTime;
          item.surplusTimeArr = TimeUtil.numberToArr(totalTime);

          list.push(item);
        });

        this.setData({
          'beatPage.list': list,
          'beatPage.total_pages': pagination.total_pages || 0,
          'beatPage.current_page': pagination.current_page || 1
        });
      }, () => {
        this.toggleBeatPageLoading(false);
      });
    }
  }
})
