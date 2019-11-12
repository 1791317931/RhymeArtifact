import TipUtil from '../../../assets/js/TipUtil';
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
    tabs: [],
    page: {
      loading: false,
      current_page: 1,
      per_page: 10,
      total_pages: 0,
      list: []
    },
    activeId: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onReachBottom() {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
      }
    },
    clickItem(e) {

    },
    showMore(e) {

    },
    getCategoryList() {
      api.getNewCategoryList({
        type: CategoryType.ARTICLE
      }, (res) => {
        let tabs = res.data.category || []
        tabs.unshift({
          id: -1,
          name: '全部'
        })

        this.setData({
          tabs
        })

        this.getPage(1)
      })
    },
    togglePageLoading(loading = true) {
      this.setData({
        'page.loading': loading
      })
    },
    getPage(pageNum = 1) {
      if (this.data.page.loading) {
        return
      }

      this.togglePageLoading()
      let page = this.data.page
      if (pageNum == 1) {
        this.setData({
          'page.list': []
        })
      }

      let param = {
        per_page: page.per_page,
        page: pageNum,
        include: 'user',
        hasCollection: 1
      }
      let categoryId = this.data.activeId
      if (categoryId != -1) {
        param.category_id = categoryId
      }

      api.getNewArticlePage(param, (res) => {
        let list = res.data
        let pagination = res.meta.pagination
        page.total_pages = pagination.total_pages
        page.current_page = pageNum

        let originList = page.list
        list.forEach(item => {
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
