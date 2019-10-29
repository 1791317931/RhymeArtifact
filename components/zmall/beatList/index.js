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
    playPercent: 0,
    showIndex: -1
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
      this.setData({
        BAC
      })
      this.setScope(scope)
      this.bindBACEvent()
    },
    onUnload() {
      this.data.BAC.destroy()
    },
    bindBACEvent() {
      let BAC = this.data.BAC;

      BAC.autoplay = true;
      BAC.onTimeUpdate(() => {
        let currentTime = BAC.currentTime
        let totalTime = BAC.duration
        let playTimeArr = TimeUtil.numberToArr(Math.ceil(currentTime))
        let totalTimeArr = TimeUtil.numberToArr(Math.ceil(totalTime))
        // 80
        let playPercent = (currentTime / totalTime > 1 ? 1 : currentTime / totalTime) * 100

        this.setData({
          playTimeArr,
          totalTimeArr,
          playPercent
        })
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
    setTabWidth() {
      let query = wx.createSelectorQuery().in(this),
        that = this;
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
      api.getGoodsCategoryList({
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
      BAC.src = this.data.page.list[index].beat_try_url

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
    continuePlay(e) {
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
    toggleCollectionItem() {
      let item = this.data.page.list[this.data.showIndex]
    },
    prevItem() {
      let showIndex = this.data.showIndex
      this.play(showIndex - 1)
    },
    nextItem() {
      let showIndex = this.data.showIndex
      this.play(showIndex + 1)
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
      this.setData({
        activeId: item.id
      })
      this.getPage(1)
    }
  }
})