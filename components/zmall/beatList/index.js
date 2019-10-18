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
    play: false,
    playTimeArr: 0,
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
    init(scope, showCategory = true) {
      this.setData({
        showCategory
      })
      this.setScope(scope)
      this.getCategoryList()
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
    onReachBottom(scope) {
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
    toggleBeat(e) {
      let index = this.getIndex(e)
      this.togglePlayIndex(index, true)
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

    },
    nextItem() {

    },
    toBuy() {
      wx.navigateTo({
        url: `/pages/zmall/buy/index?id=${this.data.page.list[this.data.showIndex].id}`
      })
    },
    share() {

    },
    togglePlayIndex(index, play) {
      if (play) {
        this.setData({
          playTimeArr: TimeUtil.numberToArr(0)
        })
      }

      this.setData({
        playIndex: index,
        play
      })
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

      this.togglePlayIndex(-1, false)
      this.togglePageLoading(true)
      let page = this.data.page
      let categoryId = this.activeId
      if (categoryId == -1) {
        categoryId = null
      }

      let param = {
        per_page: page.per_page,
        page: page.current_page
      }
      param.category_id = categoryId

      api.getGoodsPage(param, (res) => {
        let list = res.data
        page.list = list
        let pagination = res.meta.pagination
        page.total_pages = pagination.total_pages

        this.setData({
          page
        })
      }, () => {
        this.togglePageLoading(false)
      })
    },
    toggleAll() {

    },
    toggleTab(e) {

    }
  }
})