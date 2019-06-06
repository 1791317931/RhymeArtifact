import TipUtil from '../../../assets/js/TipUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import PathUtil from '../../../assets/js/PathUtil';
import CategoryType from '../../../assets/js/CategoryType';
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
        url: `/pages/mall/beatList/index?id=${item.id}&title=${item.name}`
      });
    },
    onReachBottom(scope) {

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
    getPage() {
      let page = this.data.page;
      if (page.loading) {
        return;
      }

      let param = {
        type: CategoryType.BEAT
      };

      this.togglePageLoading(true);

      api.getCategoryList(param, (res) => {
        let list = res.data;
        list.forEach((item, index) => {
          item.cover = PathUtil.getFilePath(item.image);
        });

        this.setData({
          'page.list': list
        });
      }, () => {
        this.togglePageLoading(false);
      });
    }
  }
})
