import TipUtil from '../../assets/js/TipUtil';
import ConfigUtil from '../../assets/js/ConfigUtil';
import PathUtil from '../../assets/js/PathUtil';
import OrderStatus from '../../assets/js/OrderStatus';
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
    // 订单状态：0未支付、1已支付、2已取消
    page: {
      list: [],
      loading: false,
      current_page: 1,
      per_page: 10,
      total_pages: 0,
    },
    scope: null,
    OrderStatus
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
    onReachBottom() {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
      }
    },
    clickItem(e) {
      let item = this.getItem(e);

      wx.navigateTo({
        url: '/pages/user/order/detail/index?id=' + item.id
      });
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
      setTimeout(() => {
        list = [
          {
            id: 1,
            cover: '/assets/imgs/logo.png',
            code: '56jiok;l,',
            price: 32,
            status: 0,
            created_at: '2019-06-04 10:50:22'
          },
          {
            id: 1,
            cover: '/assets/imgs/logo.png',
            code: '563213jiok;l,',
            price: 32,
            status: 1,
            created_at: '2019-06-04 10:50:22'
          },
          {
            id: 1,
            cover: '/assets/imgs/logo.png',
            code: '56jiok;l,',
            price: 3211,
            status: 2,
            created_at: '2019-06-04 10:50:22'
          }
        ]
        list.forEach(item => {
          item.created_at = item.created_at.split(' ')[0]
        })
        this.setData({
          'page.list': list,
          'page.total_pages': 1,
          'page.current_page': 1
        });
        this.togglePageLoading(false);
      }, 1000)
      return



      this.togglePageLoading(true);
      api.getMyOrderPage(param, (res) => {
        let pagination = res.meta.pagination;
        res.data.forEach((item, index) => {
          item.cover = PathUtil.getFilePath(item.cover);
          list.push(item);
        });

        this.setData({
          'page.list': list,
          'page.total_pages': parseInt(pagination.total_pages || 0),
          'page.current_page': parseInt(pagination.current_page || 1)
        });
      }, () => {
        this.togglePageLoading(false);
      });
    }
  }
})
