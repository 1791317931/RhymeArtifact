import TipUtil from '../../../assets/js/TipUtil';
import CommonUtil from '../../../assets/js/CommonUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import PathUtil from '../../../assets/js/PathUtil';
import TimeUtil from '../../../assets/js/TimeUtil';
import * as api from '../../../assets/js/api';
import CategoryType from '../../../assets/js/CategoryType'

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
    isIos: false,
    scope: null,
    tabs: [],
    BAC: null,
    activeId: -1,
    tabWidth: 10000,
    page: {
      loading: false,
      playingIndex: -1,
      playing: false,
      current_page: 1,
      per_page: 10,
      total_pages: 0,
      list: []
    },
    playIndex: -1,
    playing: false,
    playTimeArr: 0,
    totalTimeArr: 0,
    showIndex: -1,
    collecting: false,
    currentTime: 0,
    duration: 0,
    movingBar: false,
    trackContainerWidth: null,
    pageX: null,
    playPercent: 0,
    startPercent: null,
    startPageX: null,
    startPercent: null
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
    // audioContext
    init(scope, option = {}) {
      // 保持不锁屏
      wx.setKeepScreenOn({
        keepScreenOn: true
      });

      let BAC = option.audioContext || wx.createInnerAudioContext()
      // let BAC = option.audioContext || wx.getBackgroundAudioManager()
      this.setData({
        BAC,
        isIos: getApp().globalData.platform == 'ios'
      })
      this.setScope(scope)
      this.bindBACEvent()

      const query = wx.createSelectorQuery().in(this);
      query.select('#progress').boundingClientRect();
      query.exec((res) => {
        this.setData({
          trackContainerWidth: res[0].width
        });
      });
    },
    onUnload() {
      this.data.BAC.destroy()
    },
    prevent() {},
    caculateTime(currentTime) {
      let BAC = this.data.BAC
      let totalTime = BAC.duration
      let totalTimeArr = TimeUtil.numberToArr(Math.round(totalTime))
      let playPercent = (currentTime / totalTime > 1 ? 1 : currentTime / totalTime) * 100
      this.setData({
        totalTimeArr,
        duration: totalTime,
        currentTime,
        playTimeArr: TimeUtil.numberToArr(Math.round(currentTime)),
        playPercent
      })
    },
    bindBACEvent() {
      let BAC = this.data.BAC;

      BAC.autoplay = true;
      BAC.onTimeUpdate(() => {
        this.caculateTime(BAC.currentTime)
      });

      BAC.onError((res) => {
        this.audioError();
      });

      BAC.onEnded((res) => {
        this.beatAudioEnded();
      });
    },
    beatAudioEnded(e) {
      let BAC = this.data.BAC;
      this.setData({
        playing: false
      });

      BAC.seek(0);
    },
    audioError(e) {
      if (e.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
        TipUtil.message('播放失败');
      }
      this.beatAudioEnded(e);
    },
    // ---------------------拖动指针--------------------------
    touchStart(e) {
      this.setData({
        startPageX: e.touches[0].pageX,
        startPercent: this.data.playPercent,
        movingBar: true
      });

      this.pausePlay()
    },
    movePointer(e) {
      let touches = e.touches
      let prePageX = this.data.startPageX
      let pageX = e.touches[0].pageX
      let duration = this.data.duration;

      let width = pageX - prePageX
      let percent = width / this.data.trackContainerWidth;
      let currentPercent = this.data.startPercent / 100 + percent;
      currentPercent = Math.min(1, currentPercent);
      currentPercent = Math.max(0, currentPercent);
      let time = currentPercent * duration

      if (time >= duration) {
        time = duration;
        this.beatAudioEnded();
      }

      this.caculateTime(time)
    },
    touchEnd(e) {
      let BAC = this.data.BAC;
      this.setData({
        movingBar: false
      })
      BAC.seek(this.data.currentTime);
      this.continuePlay()
    },
    // ---------------------拖动指针--------------------------
    setTabWidth() {
      let query = wx.createSelectorQuery().in(this)
      let that = this;
      query.selectAll('.tab-item').boundingClientRect(function (rectList) {
        let tabWidth = 0;
        for (let i = 0; i < rectList.length; i++) {
          tabWidth += Math.ceil(rectList[i].width);
        }

        that.setData({
          tabWidth
        });
      }).exec();
    },
    getCategoryList() {
      api.getNewCategoryList({
        type: CategoryType.BEAT
      }, (res) => {
        let tabs = res.data.category || []
        tabs.unshift({
          id: -1,
          name: '全部'
        })
        this.setData({
          tabs
        })

        this.setTabWidth()
        this.getPage(1)
      })
    },
    onReachBottom() {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
      }
    },
    clickItem(e) {
      wx.navigateTo({
        url: `/pages/zmall/beatDetail/index?id=${this.getItem(e).id}`
      })
    },
    toggleItemStatus(e) {
      let index = e.currentTarget.dataset.index
      let playing = this.data.playing

      if (this.data.playIndex == index) {
        if (playing) {
          this.pausePlay(e);
        } else {
          this.continuePlay(e);
        }
      } else {
        this.startPlay(e);
      }
    },
    startPlay(e) {
      let index = this.getIndex(e)
      this.play(index)
    },
    play(index) {
      let BAC = this.data.BAC
      let beat = this.data.page.list[index]
      BAC.src = beat.beat_try_url

      this.setData({
        playIndex: index,
        playing: true
      });

      // 播放音频
      BAC.seek(0);
      BAC.play();
    },
    toggleStatus(playing) {
      this.setData({
        playing
      });
    },
    continuePlay() {
      let BAC = this.data.BAC;

      this.toggleStatus(true)
      // 播放音频
      BAC.play();
    },
    pausePlay() {
      let BAC = this.data.BAC;
      this.toggleStatus(false)

      BAC.pause();
    },
    clickMore(e) {
      let index = this.getIndex(e)
      this.setData({
        showIndex: index
      })
    },
    hideMoreModal() {
      this.setData({
        showIndex: -1
      })
    },
    toggleCollecting(collecting) {
      this.setData({
        collecting
      })
    },
    playToBuy() {
      wx.navigateTo({
        url: `/pages/zmall/buy/index?id=${this.data.page.list[this.data.playIndex].id}`
      })
    },
    toggleCollectionItem() {
      if (!CommonUtil.hasBindUserInfo()) {
        return
      }

      if (this.data.collecting) {
        return
      }

      this.toggleCollecting(true)
      let index = this.data.showIndex
      let beat = this.data.page.list[index]
      let isCollected = beat.isCollection
      let fn

      if (isCollected) {
        fn = api.deleteNewCollection
      } else {
        fn = api.addNewCollection
      }

      fn({
        id: beat.id,
        type: 'goods'
      }, (res) => {
        beat.isCollection = !isCollected

        this.setData({
          [`page.list[${index}].isCollection`]: beat.isCollection
        })
        // 操作的可能是正在播放的beat
        this.data.scope.setData({
          'beat.isCollection': beat.isCollection
        })
      }, () => {
        this.toggleCollecting(false)
      })
    },
    prevItem() {
      let showIndex = this.data.showIndex
      this.play(showIndex - 1)
    },
    nextItem() {
      let showIndex = this.data.showIndex
      if (showIndex == this.data.page.list.length - 1) {
        showIndex = -1
      }
      this.play(showIndex + 1)
      this.hideMoreModal()
    },
    toBuy() {
      wx.navigateTo({
        url: `/pages/zmall/buy/index?id=${this.data.page.list[this.data.showIndex].id}`
      })
    },
    shareItem() {
      let item = this.data.page.list[this.data.showIndex]
      return {
        title: item.goods_name,
        imageUrl: item.cover_images[0],
        path: `/pages/mall/beatList/index?id=${item.id}`
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
    getPage(pageNum = 1) {
      if (this.data.loading) {
        return
      }

      this.togglePageLoading(true)
      let page = this.data.page
      if (pageNum == 1) {
        this.setData({
          'page.list': []
        })
      }

      let param = {
        per_page: page.per_page,
        page: pageNum,
        hasCollection: 1
      }
      let categoryId = this.data.activeId
      if (categoryId != -1) {
        param.category_id = categoryId
      }

      // 活动
      if (this.data.showCategory === false) {
        param.hot = 1
        param.activity = 1
      }

      api.getGoodsPage(param, (res) => {
        let list = res.data
        let pagination = res.meta.pagination
        page.total_pages = pagination.total_pages
        page.current_page = pageNum

        let originList = page.list
        list.forEach(item => {
          item.price = new Number(parseFloat(item.original_price)).toFixed(2)
          originList.push(item)
        })
        page.list = originList

        this.setData({
          page
        })
      }, () => {
        this.togglePageLoading(false)
      })
    },
    toggleTab(e) {
      let index = this.getIndex(e);
      let item = this.data.tabs[index]
      if (item.id != this.data.activeId) {
        this.pausePlay()
        this.setData({
          activeId: item.id,
          playIndex: -1
        })
        this.getPage(1)
      }
    }
  }
})