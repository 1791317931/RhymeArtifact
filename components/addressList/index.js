import TipUtil from '../../assets/js/TipUtil';
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
    // 进入该页面时，是否可以选中某个选项
    forChoose: false
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
      this.getPage(1);
    },
    onReachBottom(scope) {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
      }
    },
    clickItem(e) {
      let forChoose = this.data.forChoose,
      address = this.getItem(e);

      if (!forChoose) {
        wx.navigateTo({
          url: '/pages/mall/address/edit/index?form=' + address
        });
      } else {
        let pages = getCurrentPages();
        pages[pages.length - 2].setData({
          address
        });
        wx.navigateBack({
          
        });
      }
    },
    toEdit(e) {
      let item = this.getItem(e);
      wx.navigateTo({
        url: '/pages/mall/address/edit/index?id=' + item.id
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




      list = [
        {
          id: 1,
          name: '张三6',
          isDefault: 1,
          phone: '12345678901',
          address: '北京市昌平区回龙观新龙城街道 新龙城小区27号楼7单元101室'
        },
        {
          id: 2,
          name: '张三5',
          isDefault: 0,
          phone: '12345678901',
          address: '北京市昌平区回龙观新龙城街道 新龙城小区27号楼7单元101室'
        },
        {
          id: 8,
          name: '张三4',
          isDefault: 0,
          phone: '12345678901',
          address: '北京市昌平区回龙观新龙城街道 新龙城小区27号楼7单元101室'
        },
        {
          id: 9,
          name: '张三3',
          isDefault: 0,
          phone: '12345678901',
          address: '北京市昌平区回龙观新龙城街道 新龙城小区27号楼7单元101室'
        },
        {
          id: 10,
          name: '张三2',
          isDefault: 0,
          phone: '12345678901',
          address: '北京市昌平区回龙观新龙城街道 新龙城小区27号楼7单元101室'
        },
        {
          id: 111,
          name: '张三11',
          isDefault: 0,
          phone: '12345678901',
          address: '北京市昌平区回龙观新龙城街道 新龙城小区27号楼7单元101室'
        }
      ]
      list.forEach(item => {
        let phone = item.phone
        item.anonymousPhone = `${phone.substring(0, 3)}****${phone.substring(7, 11)}`
      })
      this.setData({
        'page.list': list,
        'page.total_pages': 1,
        'page.current_page': 1
      });
      this.togglePageLoading(false);

      // api.getAddressPage(param, (res) => {
      //   let pagination = res.meta.pagination;

      //   res.data.forEach((item, index) => {
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
