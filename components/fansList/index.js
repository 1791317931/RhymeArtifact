import TipUtil from '../../assets/js/TipUtil';
import CommonUtil from '../../assets/js/CommonUtil';
import ConfigUtil from '../../assets/js/ConfigUtil';
import PathUtil from '../../assets/js/PathUtil';
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
      current_page: 1,
      per_page: 10,
      total_pages: 0,
      list: []
    },
    scope: null,
    tabs: [
      {
        flag: 'my-fans',
        name: '我的粉丝'
      },
      {
        flag: 'my-follow',
        name: '我的关注'
      }
    ],
    activeIndex: 0
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
      this.getPage(1);
    },
    toggleTab(e) {
      let index = e.target.dataset.index;
      if (index != this.data.activeIndex) {
        this.setData({
          activeIndex: index
        });

        this.getPage(1);
      }
    },
    followItem(e) {
      let item = this.getItem(e),
      index = this.getIndex(e),
      page = this.data.page;

      wx.showModal({
        title: '系统提示',
        content: '确认要取消关注吗？',
        success: (e) => {
          if (e.confirm) {
            api.follow({
              user_id: item.user.data.id
            }, (res) => {
              TipUtil.message('已互相关注');
              item.follow_status = true;

              this.setData({
                [`page.list[${index}]`]: item
              });
            });
          }
        }
      })
    },
    cancelFollowItem(e) {
      let item = this.getItem(e);
      wx.showModal({
        title: '系统提示',
        content: '确认要取消关注吗？',
        success: (e) => {
          if (e.confirm) {
            api.cancelFollow({
              user_id: item.user.data.id
            }, (res) => {
              TipUtil.message('已取消关注');
              this.getPage(1);
            });
          }
        }
      })
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
      let page = this.data.page;
      if (page.loading) {
        return;
      }

      let param = {
        page: current_page,
        per_page: page.per_page,
        include: 'user,follow'
      },
      list = [],
      flag = this.data.tabs[this.data.activeIndex].flag;

      if (flag == 'my-fans') {
        param.type = 1
      } else if (flag == 'my-follow') {
        param.type = 2
      }

      if (current_page > 1) {
        list = page.list;
      } else {
        this.setData({
          'page.list': []
        });
      }

      this.togglePageLoading(true);
      this.setData({
        'page.current_page': current_page
      });

      api.getFansPage(param, (res) => {
        let pagination = res.meta.pagination;

        if (flag == 'my-fans') {
          res.data.forEach((item, index) => {
            item.follow.data.avatar = PathUtil.getFilePath(item.follow.data.avatar);

            list.push(item);
          });
        } else if (flag == 'my-follow') {
          res.data.forEach((item, index) => {
            item.user.data.avatar = PathUtil.getFilePath(item.user.data.avatar);

            list.push(item);
          });
        }

        this.setData({
          'page.list': list,
          'page.total_pages': pagination.total_pages || 0,
          'page.current_page': pagination.current_page || 1
        });
      }, () => {
        this.togglePageLoading(false);
      });
    }
  }
})
