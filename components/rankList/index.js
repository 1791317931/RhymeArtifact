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
      type: 'week'
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
    setType(type) {
      this.setData({
        'page.type': type
      });
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
      let item = this.getItem(e);
      api.addFreestylePick({
        id: item.freestyle_id
      }, () => {
        TipUtil.success('投票成功');
        this.setData({
          [`page.list[${this.getIndex(e)}].pick_num`]: ++item.pick_num
        });
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
      list = [];

      if (current_page > 1) {
        list = page.list;
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
        });

        if (current_page == 1) {
          this.triggerEvent('setTopRank', topList);
        }

        this.setData({
          'page.list': list,
          'page.total_pages': pagination.total_pages || 0,
          'page.current_page': pagination.current_page || 1
        });
      }, () => {
        this.togglePageLoading(false);
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
        type: page.type
      },
      list = [];

      if (current_page > 1) {
        list = page.list;
      }

      this.togglePageLoading(true);
      this.setData({
        'page.current_page': current_page
      });

      api.getBeatPage(param, (res) => {
        let pagination = res.meta.pagination;

        res.data.forEach((item, index) => {
          item.beat_url = PathUtil.getFilePath(item.beat_url);
          item.collection_num = parseInt(item.collection_num);

          // 总时长
          let totalTime = Math.ceil(item.beat_duration / 1000);
          item.totalTime = totalTime;
          // 剩余时长
          item.surplusTime = totalTime;
          item.surplusTimeArr = TimeUtil.numberToArr(totalTime);

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