import TipUtil from '../../assets/js/TipUtil';
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
      current_page: 1,
      per_page: 10,
      total_pages: 0,
      list: []
    },
    scope: null,
    type: 'latest',
    // 超过HOT_COUNT票为热门
    HOT_COUNT: 10000
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
    },
    setType(type = 'hot') {
      this.setData({
        type
      });
    },
    onReachBottom(scope) {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
      }
    },
    clickRankItem(e) {
      let item = this.getItem(e);
      wx.navigateTo({
        url: `/pages/freestyle/play/index?id=${item.id}&userId=${item.user_id}`
      });
    },
    pick(e) {
      let scope = this.data.scope;
      if (scope.data.picking) {
        TipUtil.message('正在投票中，请稍后');
        return;
      }

      scope.togglePicking(true);
      let item = this.getItem(e);
      api.addFreestylePick({
        id: item.id
      }, (res) => {
        let img = res.data && res.data.cover;
        if (img) {
          this.data.scope.data.popImageComponent.showImg(img);
        }
        
        TipUtil.success('投票成功');
        this.setData({
          [`page.list[${this.getIndex(e)}].pick_num`]: ++item.pick_num
        });
      }, () => {
        scope.togglePicking(false);
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
    getPage(current_page = 1) {
      let page = this.data.page;
      if (page.loading) {
        return;
      }

      let param = {
        page: current_page,
        per_page: page.per_page,
        include: 'user'
      },
      list = [];

      if (current_page > 1) {
        list = page.list;
      }

      let type = this.data.type;
      // 默认查询“最新”
      if (type == 'latest') {
        param.order = '-created_at';
      } else if (type == 'hot') {
        param.order = '-created_at';
        param.isHot = 1
      }

      this.togglePageLoading(true);
      this.setData({
        'page.current_page': current_page
      });

      api.getFreestylePage(param, (res) => {
        let pagination = res.meta.pagination;

        res.data.forEach((item, index) => {
          item.user.data.avatarUrl = PathUtil.getFilePath(item.user.data.avatar);

          list.push(item);
        });

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