import TipUtil from '../../assets/js/TipUtil';
import CommonUtil from '../../assets/js/CommonUtil';
import ConfigUtil from '../../assets/js/ConfigUtil';
import PathUtil from '../../assets/js/PathUtil';
import TimeUtil from '../../assets/js/TimeUtil';
import * as api from '../../assets/js/api';
import CategoryType from '../../assets/js/CategoryType'
import BAC from '../../assets/js/components/backgroundAudio/BAC'
import MoveProgressUtil from '../../assets/js/MoveProgressUtil'

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
    playPercent: 0,
    autoPlay: true
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
    getCategoryList() {
      api.getNewCategoryList({
        type: CategoryType.MUSIC
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
        url: `/pages/create/musicDetail/index?id=${this.getItem(e).id}`
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
      let music = this.data.page.list[index]
      BAC.play({
        type: 'music',
        id: music.id,
        title: music.music_title,
        epname: music.music_title,
        singer: music.composer,
        coverImgUrl: music.musics_cover,
        src: music.origin_url
      })

      this.setData({
        playIndex: index,
        playing: true
      });
    },
    continuePlay() {
      BAC.continuePlay();
    },
    pausePlay() {
      BAC.pausePlay();
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
        url: `/pages/create/musicDetail/index?id=${this.data.page.list[this.data.playIndex].id}`
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
      let music = this.data.page.list[index]
      let isCollected = music.isCollection
      let fn

      if (isCollected) {
        fn = api.deleteNewCollection
      } else {
        fn = api.addNewCollection
      }

      fn({
        id: music.id,
        type: 'music'
      }, (res) => {
        music.isCollection = !isCollected

        this.setData({
          [`page.list[${index}].isCollection`]: music.isCollection
        })
        // 操作的可能是正在播放的music
        this.data.scope.setData({
          'music.isCollection': music.isCollection
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
        url: `/pages/create/musicDetail/index?id=${this.data.page.list[this.data.showIndex].id}`
      })
    },
    shareItem() {
      let item = this.data.page.list[this.data.showIndex]
      return {
        title: item.music_title,
        imageUrl: item.musics_cover,
        path: `/pages/study/studyList/index?t=music&id=${item.id}`
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

      api.getMusicPage(param, (res) => {
        let list = res.data
        let pagination = res.meta.pagination
        page.total_pages = pagination.total_pages
        page.current_page = pageNum

        let originList = page.list
        list.forEach(item => {
          item.isCollection = item.is_collections != 0
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
        this.setData({
          activeId: item.id
        })
        this.getPage(1)
      }
    }
  }
})