import TipUtil from '../../assets/js/TipUtil';
import ConfigUtil from '../../assets/js/ConfigUtil';
import * as api from '../../assets/js/api';
import CommonUtil from '../../assets/js/CommonUtil';

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
    init(scope) {
      this.setScope(scope);
    },
    // catchtap
    share() {

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
        url: '/pages/create/lyrics/index?id=' + item.id
      });
    },
    shareLyric(e) {
      if (e.from == 'button') {
        let item = this.getItem(e);

        return {
          title: CommonUtil.getShareTitle(),
          imageUrl: CommonUtil.getShareImage(),
          path: '/pages/main/index?lyricId=' + item.id
        };
      }
    },
    remove(e) {
      let item = this.getItem(e);
      wx.showModal({
        title: '系统提示',
        content: '确认要删除该数据吗？',
        success: (e) => {
          if (e.confirm) {
            api.deleteLyricById({
              lyric_id: item.id
            }, (res) => {
              TipUtil.message('操作成功');
              this.getPage(1);
            });
          }
        }
      });
    },
    getItem(e) {
      let index = this.getIndex(e);

      return this.data.page.list[index];
    },
    getIndex(e) {
      let index = e.target.dataset.index;
      if (isNaN(index)) {
        index = e.currentTarget.dataset.index;
      }

      return parseInt(index);
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

      this.togglePageLoading(true);
      this.setData({
        'page.current_page': current_page
      });

      api.getLyricPage(param, (res) => {
        let pagination = res.meta.pagination;

        res.data.forEach((item, index) => {
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
