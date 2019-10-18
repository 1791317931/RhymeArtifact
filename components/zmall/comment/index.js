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
      this.togglePageLoading(true)
      setTimeout(() => {
        let list = [
          {
            id: 1,
            user: {
              name: '牛大头',
              avatar: '/assets/imgs/mall/share.png'
            },
            created_at: Date.now(),
            content: '一双纯白的球鞋挑个拉风的tee我随便freestyle的歌词他们发疯的记我们的风格是新的我搭配是新的我吐出的歌词全部变成了金子'
          },
          {
            id: 2,
            user: {
              id: 1,
              name: '牛大头1',
              avatar: '/assets/imgs/mall/share.png'
            },
            to: {
              id: 2,
              name: '张三'
            },
            created_at: Date.now(),
            content: '一双纯白的球鞋挑个拉风的tee我随便freestyle的歌词他们发疯的记我们的风格是新的我搭配是新的我吐出的歌词全部变成了金子'
          }
        ]

        list.forEach(item => {
          item.created_at = DateUtil.getFormatTime(new Date(item.created_at))
        })

        this.setData({
          'page.list': list
        })
        this.togglePageLoading(false)
      })
    }
  }
})
