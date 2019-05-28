import TipUtil from '../../../assets/js/TipUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import PathUtil from '../../../assets/js/PathUtil';
import * as api from '../../../assets/js/api';

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
    init(scope, renderCallback) {
      this.setScope(scope);
    },
    clickItem(e) {
      let item = this.getItem(e);
      wx.navigateTo({
        url: `/pages/mall/beatDetail/index?type=round&id=${item.id}`
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
      let page = this.data.page;
      if (page.loading) {
        return;
      }

      let param = {
        page: current_page,
        per_page: page.per_page
      },
        list = [];

      if (current_page > 1) {
        list = page.list;
      }

      this.togglePageLoading(true);
      this.setData({
        'page.current_page': current_page
      });

      setTimeout(() => {
        let list = [
          {
            id: 1,
            name: 'Old schoolOld schoolOld schoolOld schoolOld schoolOld schoolOld schoolOld schoolOld schoolOld schoolOld school',
            cover: '/assets/imgs/logo.png',
            price: 999,
            buy_count: 111
          },
          {
            id: 2,
            name: 'Trap',
            cover: '/assets/imgs/logo.png',
            price: 99,
            buy_count: 111
          },
          {
            id: 3,
            name: '旋律',
            cover: '/assets/imgs/logo.png',
            price: 99999999,
            buy_count: 111
          },
          {
            id: 4,
            name: '中国·异域风中国·异域风中国·异域风中国·异域风中国·异域风中国·异域风中国·异域风中国·异域风中国·异域风',
            cover: '/assets/imgs/logo.png',
            price: 99999999,
            buy_count: 111
          }
        ]
        this.setData({
          'page.list': list,
          'page.total_pages': 1,
          'page.current_page': 1
        });
        this.togglePageLoading(false);
      }, 100);

      // api.getRoundInMall(param, (res) => {
      //   let pagination = res.meta.pagination;

      //   res.data.forEach((item, index) => {
      //     item.beat_url = PathUtil.getFilePath(item.beat_url);

      //     list.push(item);
      //   });

      //   this.setData({
      //     'page.list': list,
      //     'page.total_pages': pagination.total_pages || 0,
      //     'page.current_page': pagination.current_page || 1
      //   });
      // }, () => {
      //   this.togglePageLoading(false);
      // });
    }
  }
})
