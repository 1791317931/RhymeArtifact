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
    BAC: null,
    scope: null,
    categoryId: null
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
      let BAC = wx.createInnerAudioContext();
      this.setData({
        BAC
      });
      this.bindBACEvent();
    },
    isFreeStyle(isFreeStyle = true) {
      this.setData({
        'page.isFreeStyle': isFreeStyle
      });
    },
    onUnload() {
      this.data.BAC.destroy();
    },
    bindBACEvent() {
      let BAC = this.data.BAC;
      
      BAC.autoplay = true;
      BAC.onTimeUpdate(() => {
        this.audioTimeUpdate(BAC.duration, BAC.currentTime);
      });

      BAC.onError((res) => {
        this.audioError();
      });

      BAC.onEnded((res) => {
        this.audioEnded();
      });
    },
    toggleItemStatus(e) {
      let index = e.currentTarget.dataset.index,
        page = this.data.page,
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
    toggleCollectionItem(e) {
      let item = this.getItem(e),
        index = this.getIndex(e),
        page = this.data.page,
        type = 'beat';

      if (item.isCollection || page.showCollection) {
        api.deleteCollection({
          id: item.id,
          type
        }, (res) => {
          TipUtil.message('已取消收藏');

          // 显示我的收藏，把被取消收藏的伴奏去掉
          if (page.showCollection) {
            let list = page.list;
            list.splice(index, 1);

            this.setData({
              'page.list': list
            });
          } else {
            item.isCollection = false;
            item.collection_num--;

            this.setData({
              [`page.list[${index}]`]: item
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
            [`page.list[${index}]`]: item
          });
        });
      }
    },
    shareItem(e) {
      return {
        title: CommonUtil.getShareTitle(),
        imageUrl: CommonUtil.getShareImage(),
        path: '/pages/create/beatList/index'
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
        'page.playingIndex': index,
        'page.playing': true
      });

      // 播放音频
      BAC.seek(0);
      BAC.play();
    },
    continuePlay(e) {
      let BAC = this.data.BAC;

      this.setData({
        'page.playing': true
      });

      // 播放音频
      BAC.play();
    },
    pausePlay(e) {
      let BAC = this.data.BAC;

      this.setData({
        'page.playing': false
      });

      BAC.pause();
    },
    beatAudioEnded(e) {
      let BAC = this.data.BAC;

      this.setData({
        'page.playing': false
      });

      BAC.seek(0);
    },
    audioError(e) {
      if (e.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
        TipUtil.message('播放失败');
      }
      this.beatAudioEnded(e);
    },
    audioTimeUpdate(totalTime, time) {
      this.caculateSurplusTime(totalTime, time);
    },
    // 计算剩余时间
    caculateSurplusTime(totalTime, currentTime) {
      let surplusTime = parseInt(totalTime - currentTime),
        playingIndex = this.data.page.playingIndex,
        item = this.data.page.list[playingIndex];

      item.surplusTime = surplusTime;
      item.surplusTimeArr = TimeUtil.numberToArr(surplusTime);

      this.setData({
        [`page.list[${playingIndex}]`]: item
      });
    },
    toRecord(e) {
      this.pausePlay(e);

      let item = this.getItem(e),
      page = this.data.page,
      isFreeStyle = page.isFreeStyle;

      // 录制freestyle
      if (isFreeStyle) {
        let pages = getCurrentPages();
        pages[pages.length - 2].setBeatItem(item);
        
        wx.navigateBack({
          
        });
      } else {
        // 录制作品
        wx.navigateTo({
          url: '/pages/create/record/index?beatItem=' + JSON.stringify(item)
        });
      }
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
        per_page: page.per_page,
        hasCollection: 1
      },
      list = [];

      if (current_page > 1) {
        list = page.list;
      }

      this.togglePageLoading(true);
      this.setData({
        'page.current_page': current_page
      });

      let fn;
      if (this.data.page.showCollection) {
        fn = api.getCollection;

        param.type = 'beat';
      } else {
        fn = api.getBeatPage;
      }

      if (page.isFreeStyle) {
        delete param.hasCollection
      }

      if (this.data.categoryId) {
        param.category_id = this.data.categoryId;
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
