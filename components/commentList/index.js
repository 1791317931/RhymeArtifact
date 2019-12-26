import TipUtil from '../../assets/js/TipUtil';
import DateUtil from '../../assets/js/DateUtil';
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
      current_page: 1,
      per_page: 10,
      total_pages: 0,
      list: []
    },
    scope: null,
    type: null,
    objectId: null,
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
      this.setScope(scope);
      this.getMyInfo();
    },
    getMyInfo() {
      api.getMyInfo({}, (res) => {
        let user = res.data;
        this.setData({
          user
        });
      });
    },
    togglePraise(e) {
      let item = this.getItem(e),
      index = this.getIndex(e),
      page = this.data.page;

      if (item.is_like) {
        api.deleteFreestyleCommentPraise({
          commentId: item.id
        }, (res) => {
          TipUtil.message('已取消点赞');

          item.is_like = false;
          item.like_count--;

          this.setData({
            [`page.list[${index}]`]: item
          });
        });
      } else {
        api.addFreestyleCommentPraise({
          commentId: item.id
        }, (res) => {
          TipUtil.message('点赞成功');
          item.is_like = true;
          item.like_count++;

          this.setData({
            [`page.list[${index}]`]: item
          });
        });
      }
    },
    deleteItem(e) {
      let item = this.getItem(e);
      wx.showModal({
        title: '系统提示',
        content: '确认要删除该条评论吗？',
        success: (e) => {
          if (e.confirm) {
            api.deleteFreestyleComment({
              commentId: item.id
            }, (res) => {
              TipUtil.message('操作成功');
              this.getPage(1);
            });
          }
        }
      });
    },
    onReachBottom(scope) {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
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
    getPage(current_page = 1) {
      let data = this.data,
      page = data.page;
      
      if (page.loading) {
        return;
      }

      let param = {
        page: current_page,
        per_page: page.per_page,
        hasPraise: 1,
        type: data.type,
        objectId: data.objectId,
        include: 'user'
      },
      list = [];

      if (current_page > 1) {
        list = page.list;
      }

      this.togglePageLoading(true);
      this.setData({
        'page.current_page': current_page
      });

      let fn = null;
      if (param.type == 'freestyle') {
        fn = api.getFreestyleCommentPage;
      }

      fn(param, (res) => {
        let pagination = res.meta.pagination;

        res.data.forEach((item, index) => {
          item.like_count = parseInt(item.like_count || 0);
          item.user.avatar = PathUtil.getFilePath(item.user.data.avatar);
          item.created_at = DateUtil.friendlyTime(item.created_at)
          list.push(item);
        });

        this.setData({
          'page.list': list,
          'page.total_pages': pagination.total_pages || 0,
          'page.current_page': pagination.current_page || 1
        });
        this.data.scope.setData({
          totalComment: pagination.total
        });
      }, () => {
        this.togglePageLoading(false);
      });
    }
  }
})