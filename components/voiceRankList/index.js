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
      list: [],
      allList: []
    },
    scope: null
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
    onReachBottom(scope) {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getTopRankList(page.current_page + 1);
      }
    },
    clickRankItem(e) {
      let item = this.getItem(e);
      wx.navigateTo({
        url: `/pages/freestyle/play/index?id=${item.freestyle_id}&userId=${item.user_id}`
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
        id: item.freestyle_id
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
    getTopRankList(current_page = 1) {
      let page = this.data.page;
      if (page.loading) {
        return;
      }

      let param = {
        page: current_page,
        per_page: page.per_page
      },
      list = [],
      allList = [];

      if (current_page > 1) {
        list = page.list;
        allList = page.allList;
      }

      this.togglePageLoading(true);
      this.setData({
        'page.current_page': current_page
      });

      api.getFreestyleTopRank(param, (res) => {
        let topList = [];
        let pagination = res.meta.pagination;

        res.data.forEach((item, index) => {
          item.avatarUrl = PathUtil.getFilePath(item.avatar);

          if (current_page == 1 && index < 3) {
            topList.push(item);
          } else {
            list.push(item);
          }
          allList.push(item);
        });

        if (current_page == 1) {
          this.triggerEvent('setTopRank', topList);
        }

        this.setData({
          'page.list': list,
          'page.allList': allList,
          'page.total_pages': pagination.total_pages || 0,
          'page.current_page': pagination.current_page || 1
        });
      }, () => {
        this.togglePageLoading(false);
      });
    }
  }
})