import TipUtil from '../../assets/js/TipUtil';
import CommonUtil from '../../assets/js/CommonUtil';
import ConfigUtil from '../../assets/js/ConfigUtil';
import PathUtil from '../../assets/js/PathUtil';
import TimeUtil from '../../assets/js/TimeUtil';
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
    MAC: null,
    user: null
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
      let MAC = wx.createInnerAudioContext();
      let user = wx.getStorageSync('userInfo')
      this.setData({
        MAC,
        user
      });

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
      this.data.scope.data.musicPosterComponent.generatePoster(item, 'music');
    },
    startPlay(e) {
      let index = this.getIndex(e),
      item = this.getItem(e),
      MAC = this.data.MAC;

      MAC.src = item.mixture_url || item.origin_url;
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
        hasCollection: 1,
        include: 'user'
      }
      let list = [];

      if (current_page > 1) {
        list = page.list;
      }

      this.togglePageLoading(true);
      this.setData({
        'page.page': current_page
      });

      let fn;
      if (this.data.page.showCollection) {
        fn = api.getCollectionMusicPage;
      } else {
        if (this.data.page.showMine) {
          fn = api.getMusicPage
          param.user_id = this.data.user.id
        } else {
          fn = api.getMusicPage;
        }
      }

      fn(param, (res) => {
        let pagination = res.meta.pagination;

        res.data.forEach((item, index) => {
          item.origin_url = PathUtil.getFilePath(item.origin_url);
          item.mixture_url = item.mixture_url && PathUtil.getFilePath(item.mixture_url);
          item.collection_num = parseInt(item.collection_num);
          item.share_num = parseInt(item.share_num);

          if (!this.data.page.showMine) {
            item.user.data.avatar = PathUtil.getFilePath(item.user.data.avatar);
          }

          // 总时长
          let totalTime = Math.ceil(parseInt(0) / 1000);
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
        api.deleteNewCollection({
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
        api.addNewCollection({
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

        return {
          title: CommonUtil.getShareTitle(),
          imageUrl: CommonUtil.getShareImage(),
          path: '/pages/study/studyList/index?type=music'
        };
      }
    }
  },
})
