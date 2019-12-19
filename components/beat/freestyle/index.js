import TipUtil from '../../../assets/js/TipUtil';
import CommonUtil from '../../../assets/js/CommonUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import PathUtil from '../../../assets/js/PathUtil';
import TimeUtil from '../../../assets/js/TimeUtil';
import * as api from '../../../assets/js/api';
import CategoryType from '../../../assets/js/CategoryType'
import BAC from '../../../assets/js/components/backgroundAudio/BAC'
import MoveProgressUtil from '../../../assets/js/MoveProgressUtil'

let app = getApp()
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
    activeId: -1,
    tabWidth: 10000,
    page: {
      isFreeStyle: false,
      loading: false,
      playingIndex: -1,
      playing: false,
      current_page: 1,
      per_page: 10,
      total_pages: 0,
      list: []
    },
    playing: false,
    playTimeArr: 0,
    totalTimeArr: 0,
    showIndex: -1,
    collecting: false,
    currentTime: 0,
    duration: 0,
    movingBar: false,
    trackContainerWidth: null,
    playPercent: 0,
    playIndex: -1,
    autoPlay: true,
    // 是否显示播放状态
    showPlaying: true
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

      this.setScope(scope)

      const query = wx.createSelectorQuery().in(this);
      query.select('#progress').boundingClientRect();
      query.exec((res) => {
        this.setData({
          trackContainerWidth: res[0].width
        });
      });
    },
    setStatus() {
      this.setData({
        autoPlay: BAC.autoPlay
      })
    },
    prevent() { },
    // ---------------------拖动指针--------------------------
    touchStart(e) {
      MoveProgressUtil.touchStart(e)
    },
    movePointer(e) {
      MoveProgressUtil.movePointer(e)
    },
    touchEnd(e) {
      MoveProgressUtil.touchEnd(e)
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
    onReachBottom() {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
      }
    },
    toggleItemStatus(e) {
      let index = e.currentTarget.dataset.index
      let playing = this.data.playing
      this.setData({
        autoPlay: false
      })

      // 必须是允许显示播放状态的情况下，才能继续播放或者暂停
      if (this.data.showPlaying && this.data.playIndex == index) {
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
      let beat = this.data.page.list[index]
      BAC.play({
        type: 'beat',
        id: beat.id,
        title: beat.goods_name,
        epname: beat.goods_name,
        singer: beat.author,
        coverImgUrl: beat.cover_images[0],
        src: beat.beat_try_url
      })

      this.setData({
        playIndex: index,
        showPlaying: true
      })
    },
    continuePlay() {
      // 播放音频
      BAC.continuePlay();
    },
    pausePlay() {
      BAC.pausePlay();
    },
    toRecordItem(e) {
      let item = this.getItem(e)
      let page = this.data.page
      let isFreeStyle = page.isFreeStyle

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
    toRecord() {
      let item = this.data.page.list[this.data.playIndex]
      let pages = getCurrentPages();
      pages[pages.length - 2].setBeatItem(item);

      wx.navigateBack({

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
        hasCollection: 1,
        // 免费
        category_id: 29
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
    }
  }
})