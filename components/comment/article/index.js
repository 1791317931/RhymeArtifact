import CommonUtil from '../../../assets/js/CommonUtil'
import DateUtil from '../../../assets/js/DateUtil'
import TipUtil from '../../../assets/js/TipUtil'
import * as api from '../../../assets/js/api'

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
    isAudient: true,
    page: {
      loading: false,
      current_page: 1,
      per_page: 10,
      total_pages: 0,
      list: [],
      total_count: 0
    },
    loadModalComponent: null,
    targetId: null,
    commentContent: '',
    commentFocus: false,
    replyContent: '',
    replyFocus: false,
    type: 'posts',
    user: null,
    tempIndex: -1,
    showModal: false,
    typeMap: {
      posts: '文章',
      video: '视频'
    },
    linkUsComponent: null,
    data: null,
    isCollecting: false
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
      let loadModalComponent = this.selectComponent('#loadModalComponent')
      let linkUsComponent = this.selectComponent('#linkUsComponent')
      this.setData({
        user: wx.getStorageSync('userInfo'),
        loadModalComponent,
        linkUsComponent,
        isAudient: CommonUtil.isAudient()
      })
    },
    onReachBottom() {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
      }
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
    replyContentFocus() {
      this.setData({
        replyFocus: true
      });
    },
    changeReplyContent(e) {
      this.setData({
        replyFocus: false
      });
    },
    sendComment(e) {
      let data = this.data
      let content = e.detail.value.commentContent.trim();

      if (!content) {
        TipUtil.message('评论内容不能为空');
        return;
      }

      api.addNewComment({
        type: this.data.type,
        product_id: data.targetId,
        parent_id: 0,
        content
      }, (res) => {
        TipUtil.success('评论成功');
        this.setData({
          commentContent: ''
        })
        this.getPage(1);
      });
    },
    reply(e) {
      let data = this.data
      let content = e.detail.value.replyContent.trim();

      if (!content) {
        TipUtil.message('回复内容不能为空');
        return;
      }

      api.addNewComment({
        type: this.data.type,
        product_id: data.targetId,
        parent_id: this.data.page.list[this.data.tempIndex].id,
        content
      }, (res) => {
        TipUtil.success('回复成功');
        this.setData({
          commentContent: '',
          tempIndex: -1
        })
        this.getPage(1);
      });
    },
    toReply(e) {
      this.setData({
        tempIndex: this.getIndex(e),
        replyContent: ''
      })
    },
    cancelReply() {
      this.setData({
        tempIndex: -1
      })
    },
    toDelete(e) {
      let item = this.getItem(e)
      wx.showModal({
        title: '提示',
        content: '确认删除该条评论吗?',
        success: (sm) => {
          if (sm.confirm) {
            this.toggleLoadsubmitting(true)
            api.deleteNewComment({
              type: this.data.type,
              id: item.id
            }, (res) => {
              TipUtil.message('操作成功')
              this.getPage(1)
            }, () => {
              this.toggleLoadsubmitting(false)
            })
          }
        }
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
    toggleLoadsubmitting(loading) {
      this.data.loadModalComponent.setData({
        loading
      })
    },
    togglePageLoading(loading) {
      this.setData({
        'page.loading': loading
      });
    },
    getPage(pageNum = 1) {
      if (this.data.page.loading) {
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
        type: this.data.type,
        include: 'user,parentuser,parentcomment',
        id: this.data.targetId
      }

      api.getNewCommentPage(param, (res) => {
        let list = res.data
        let pagination = res.meta.pagination
        page.total_pages = pagination.total_pages
        page.total_count = pagination.total
        page.current_page = pageNum
        this.data.scope.setData({
          commentCount: pagination.total
        })

        let originList = page.list
        list.forEach(item => {
          item.price = new Number(parseFloat(item.original_price)).toFixed(2)
          item.active = false
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
    showLinkUsModal() {
      this.data.linkUsComponent.toggleModal(true)
    },
    toggleCollecting(isCollecting) {
      this.setData({
        isCollecting
      })
    },
    toggleCollection() {
      if (this.data.isCollecting) {
        return
      }

      let data = this.data.data
      let fn
      let param = {
        type: this.data.type,
        id: data.id
      }

      if (data.is_collections == 1) {
        fn = api.deleteNewCollection
      } else {
        fn = api.addNewCollection
      }

      this.toggleCollecting(true)
      fn(param, (res) => {
        TipUtil.success('操作成功')
        // 需要同步组件即可，不需要同步到外部
        this.setData({
          'data.is_collections': data.is_collections == 1 ? 0 : 1,
          'data.collection_num': data.is_collections == 1 ? --data.collection_num : ++data.collection_num
        })
      }, () => {
        this.toggleCollecting(false)
      })
    }
  }
})