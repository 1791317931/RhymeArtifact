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
      per_page: 10,
      current_page: 1,
      list: []
    },
    BAC: null,
    MAC: null
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
      let MAC = wx.createInnerAudioContext();
      this.setData({
        MAC
      });

      // this.bindBACEvent();
      this.bindMACEvent();
    },
    onUnload() {
      this.data.MAC.destroy();
    },
    bindMACEvent() {
      let MAC = this.data.MAC;

      MAC.autoplay = true;
      MAC.onTimeUpdate(() => {
        this.musicAudioTimeUpdate(MAC.duration, MAC.currentTime);
      });

      MAC.onError((res) => {
        this.musicAudioError();
      });

      MAC.onEnded((res) => {
        this.musicAudioEnded();
      });
    },
    // bindBACEvent() {
    //   let BAC = this.data.BAC;

    //   BAC.autoplay = true;
    //   BAC.onTimeUpdate(() => {
    //     this.audioTimeUpdate(BAC.duration, BAC.currentTime);
    //   });

    //   BAC.onError((res) => {
    //     this.audioError();
    //   });

    //   BAC.onEnded((res) => {
    //     this.audioEnded();
    //   });
    // },
    toggleItemStatus(e) {
      let index = this.getIndex(e),
        page = this.data.page,
        playing = page.playing,
        MAC = this.data.MAC;

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
    onReachBottom() {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
      }
    },
    // 下载海报
    generatePoster(e) {
      let item = this.getItem(e);
      PosterCanvasUtil.draw(this.data.scope, item, 'music');
    },
    startPlay(e) {
      let index = this.getIndex(e),
      MAC = this.data.MAC;

      MAC.src = this.getItem(e).origin_url;
      this.setData({
        'page.playingIndex': index,
        'page.playing': true
      });

      // 播放音频
      MAC.seek(0);
      MAC.play();
    },
    continuePlay(e) {
      let MAC = this.data.MAC;

      this.setData({
        'page.playing': true
      });

      // 播放音频
      MAC.play();
    },
    pausePlay(e) {
      let MAC = this.data.MAC;

      this.setData({
        'page.playing': false
      });

      MAC.pause();
    },
    musicAudioEnded(e) {
      let MAC = this.data.MAC;

      this.setData({
        'page.playing': false
      });

      MAC.seek(0);
    },
    musicAudioError(e) {
      if (e.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
        TipUtil.message('播放失败');
      }
      this.musicAudioEnded(e);
    },
    musicAudioTimeUpdate(totalTime, time) {
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
    removeItem(e) {
      wx.showModal({
        title: '系统提示',
        content: '是否删除当前音乐作品？',
        success: (res) => {
          if (res.confirm) {
            let item = this.getItem(e)
            api.removeMusic({
              id: item.id
            }, (res) => {
              TipUtil.message('操作成功');
              this.getPage(1);
            });
          }
        }
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
        'page.page': current_page
      });

      let fn;
      if (this.data.page.showCollection) {
        fn = api.getCollection;

        param.type = 'music';
        param.include = 'beat,user';
      } else {
        if (this.data.page.showMine) {
          fn = api.getMyMusicPage;
          param.include = 'beat';
        } else {
          fn = api.getMusicPage;
          param.include = 'beat,user';
        }
      }

      fn(param, (res) => {
        let pagination = res.meta.pagination;

        res.data.forEach((item, index) => {
          item.origin_url = PathUtil.getFilePath(item.origin_url) || '/assets/imgs/logo.png';
          item.collection_num = parseInt(item.collection_num);
          item.share_num = parseInt(item.share_num);

          // 总时长
          let totalTime = Math.ceil(parseInt(item.music_duration) / 1000);
          item.totalTime = totalTime;
          // 剩余时长
          item.surplusTime = totalTime;
          item.surplusTimeArr = TimeUtil.numberToArr(totalTime);

          list.push(item);
        });

        this.setData({
          'page.list': list,
          'page.current_page': pagination.current_page || 1,
          'page.total_pages': pagination.total_pages || 0
        });
      }, () => {
        this.togglePageLoading(false);
      });
    },
    toggleCollectItem(e) {
      let item = this.getItem(e),
        index = this.getIndex(e),
        page = this.data.page,
        type = 'music';

      if (item.isCollection || page.showCollection) {
        api.deleteCollection({
          id: item.id,
          type
        }, (res) => {
          TipUtil.message('已取消收藏');

          // 显示我的收藏，把被取消收藏的创作去掉
          if (this.data.page.showCollection) {
            let list = page.list;
            list.splice(index, 1);

            this.setData({
              'page.list': list
            });
          } else {
            item.collection_num--;
            item.isCollection = false;

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
          item.collection_num++;
          item.isCollection = true;

          this.setData({
            [`page.list[${index}]`]: item
          });
        });
      }
    },
    shareItem(e) {
      if (e.from == 'button') {
        let item = this.getItem(e),
          index = this.getIndex(e);

        api.share({
          id: item.id,
          type: 'music'
        }, (res) => {
          item.share_num = item.share_num + 1;
          this.setData({
            [`page.list[${index}]`]: item
          });
        });

        let random = CommonUtil.getShareRandom();
        return {
          title: CommonUtil.shareRandomMsgs[random],
          imageUrl: CommonUtil.getShareImage(random),
          path: '/pages/create/beatList/index?type=music',
          success: (res) => {

          },
          fail(res) {

          },
          complete(res) {

          }
        };
      }
    }
  },
})
