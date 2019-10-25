import DateUtil from '../../../assets/js/DateUtil'
import TipUtil from '../../../assets/js/TipUtil'

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
      current_page: 1,
      per_page: 10,
      total_pages: 0,
      list: [],
      total_count: 100
    },
    beatId: null,
    commentContent: ''
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
      this.setScope(scope)
    },
    commentContentFocus() {
      this.setData({
        commentFocus: true
      });
    },
    changeCommentContent(e) {
      this.setData({
        commentFocus: false
      });
    },
    submit(e) {
      let data = this.data,
        content = e.detail.value.commentContent.trim();

      if (!content) {
        TipUtil.message('评论内容不能为空');
        return;
      }

      api.addFreestyleComment({
        freestyleId: data.fs.id,
        content
      }, (res) => {
        TipUtil.success('评论成功');
        this.setData({
          commentContent: ''
        })
        this.data.commentListComponent.getPage(1);
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
      return



      
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
        include: 'user,parentuser,parentcomment'
      }
      let categoryId = this.data.activeId
      if (categoryId != -1) {
        param.category_id = categoryId
      }

      api.getNewCommentPage(param, (res) => {
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
