import TipUtil from '../../assets/js/TipUtil';
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
    // 订单状态：0未支付、1已支付、2已取消
    page: {
      list: [],
      loading: false,
      current_page: 1,
      per_page: 10,
      total_pages: 0,
    },
    tabs: [
      {
        flag: 'buy-order',
        text: '购买订单'
      },
      {
        flag: 'sale-order',
        text: '售卖订单'
      }
    ],
    activeFlag: 'buy-order',
    skuMap: {
      1: {
        title: '标准MP3租赁',
        format: 'MP3格式音频'
      },
      2: {
        title: '高级WAV租赁',
        format: 'MP3和WAV格式音频'
      },
      3: {
        title: '分轨音频租赁',
        format: 'MP3、WAV和分轨格式音频文件'
      },
      4: {
        title: '独家买断',
        format: 'MP3、WAV和分轨格式音频文件'
      }
    },
    scope: null,
    orderStatusMap: {
      0: '待支付',
      1: '已支付',
      2: '已取消',
      3: '支付超时'
    }
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
      let index = this.getIndex(e)
      let item = this.getItem(e)
      item.open = !item.open
      this.setData({
        [`page.list[${index}]`]: item
      })
    },
    toDetail(e) {
      let item = this.getItem(e);
      wx.navigateTo({
        url: '/pages/zmall/beatDetail/index?id=' + item.goods_id
      });
    },
    toggleTab(e) {
      let activeFlag = this.data.activeFlag
      let currentFlag = this.data.tabs[e.target.dataset.index].flag
      if (currentFlag != activeFlag) {
        this.setData({
          activeFlag: currentFlag
        })
        this.getPage(1)
      }
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
        include: 'goods,goodsSku,goodsUser'
      }
      console.log(JSON.stringify(param))
      let list = [];

      if (current_page > 1) {
        list = page.list;
      } else {
        this.setData({
          'page.list': []
        })
      }

      this.togglePageLoading(true);
      let flag = this.data.activeFlag
      if (flag == 'buy-order') {
        api.getOrderPage(param, (res) => {
          let pagination = res.meta.pagination;
          res.data.forEach((item, index) => {
            item.open = false
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
      } else if (flag == 'sale-order') {
        api.getMyIncomePage(param, (res) => {
          let data = res.data
          data.lists.data.forEach((item, index) => {
            item.open = false
            list.push(item);
          });

          this.setData({
            'page.list': list,
            'page.total_pages': parseInt(data.last_page || 0),
            'page.current_page': parseInt(data.from || 1)
          });
        }, () => {
          this.togglePageLoading(false);
        });
      }
    }
  }
})
