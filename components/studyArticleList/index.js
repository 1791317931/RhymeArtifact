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
    systemName: getApp().globalData.appName,
    page: {
      list: [],
      loading: false,
      current_page: 1,
      per_page: 5,
      total_pages: 0,
      showCollection: false
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
    share() {
      
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
    toggleCollectionItem(e) {
      let item = this.getItem(e),
      index = this.getIndex(e),
      page = this.data.page,
      type = 'post';

      if (item.isCollection || page.showCollection) {
        api.deleteCollection({
          id: item.id,
          type
        }, (res) => {
          TipUtil.message('已取消收藏');

          // 显示我的收藏，把被取消收藏去掉
          if (this.data.page.showCollection) {
            let list = page.list;
            list.splice(index, 1);

            this.setData({
              'page.list': list
            });
          } else {
            item.collection_num--;
            item.isCollection = false;

            this.setData({
              [`page.list[${index}]`]: item
            });
          }
        });
      } else {
        api.addCollection({
          id: item.id,
          type
        }, (res) => {
          TipUtil.message('收藏成功');
          item.collection_num++;
          item.isCollection = true;

          this.setData({
            [`page.list[${index}]`]: item
          });
        });
      }
    },
    // 下载海报
    generatePoster(e) {
      let item = this.getItem(e);
      this.getPosterInfo(item, this.getIndex(e), () => {
        this.data.scope.data.musicPosterComponent.generatePoster(item, 'article');
      });
    },
    shareItem(e) {
      if (e.from == 'button') {
        let item = this.getItem(e),
          index = this.getIndex(e);

        api.share({
          id: item.id,
          type: 'course'
        }, (res) => {
          item.share_num++;

          this.setData({
            [`page.list[${index}]`]: item
          });
        });

        return {
          title: item.title,
          imageUrl: item.cover,
          path: '/pages/study/studyList/index?type=article&id=' + item.id
        };
      }
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
        url: '/pages/study/studyArticle/index?id=' + item.id
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
        per_page: page.per_page,
        type: 'posts',
        include: 'author',
        hasCollection: 1
      },
      list = [];

      if (current_page > 1) {
        list = page.list;
      }

      let fn;
      if (this.data.page.showCollection) {
        fn = api.getCollection;

        param.type = 'post';
        delete param.include;
      } else {
        fn = api.getStudyPage;
      }

      this.togglePageLoading(true);
      fn(param, (res) => {
        let pagination = res.meta.pagination;
        res.data.forEach((item, index) => {
          let cover = PathUtil.getFilePath(item.cover);
          item.cover = cover;
          item.collection_num = parseInt(item.collection_num);
          list.push(item);
        });

        this.setData({
          'page.list': list,
          'page.total_pages': parseInt(pagination.total_pages || 0),
          'page.current_page': parseInt(pagination.current_page || 1)
        });
      }, () => {
        this.setData({
          'page.loading': false
        });
      });
    },
    getPosterInfo(item, index, callback) {
      // 已经获取过本地图片
      if (item.temp_cover) {
        callback && callback(path);
        return;
      }

      wx.showLoading({
        title: '海报生成中...',
      });
      wx.getImageInfo({
        src: item.cover,
        success: (res) => {
          let path = res.path;
          this.setData({
            [`page.list[${index}].temp_cover`]: path
          });
          callback && callback(path);
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    }
  }
})
