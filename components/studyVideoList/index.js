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
    page: {
      list: [],
      loading: false,
      page: 1,
      per_page: 10,
      total_pages: 0,
      current_page: 1,
      showCollection: false
    },
    scope: null,
    category_id: null,
    userId: null
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
      // 保持不锁屏
      wx.setKeepScreenOn({
        keepScreenOn: true
      });
      
      this.setScope(scope);
    },
    // 阻止跳转
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
    // 下载海报
    generatePoster(e) {
      let item = this.getItem(e);
      this.getPosterInfo(item, this.getIndex(e), () => {
        this.data.scope.data.musicPosterComponent.generatePoster(item, 'video');
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
          title: item.course_title,
          imageUrl: item.course_cover,
          path: '/pages/study/studyVideo/index?type=video&id=' + item.id
        };
      }
    },
    onReachBottom() {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
      }
    },
    toggleCollectionItem(e) {
      let item = this.getItem(e),
        index = this.getIndex(e),
        page = this.data.page,
        type = 'course';

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
    clickItem(e) {
      let item = this.getItem(e);

      wx.navigateTo({
        url: '/pages/study/studyVideo/index?id=' + item.id
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
        type: 'courses',
        include: 'author',
        hasCollection: 1,
        category_id: this.data.category_id
      },
      list = [];

      if (current_page > 1) {
        list = page.list;
      }

      let userId = this.data.userId
      if (userId) {
        param.user_id = userId
      }

      let fn
      if (userId) {
        fn = api.getMyVideoPage
      } else if (this.data.page.showCollection) {
        fn = api.getCollection;

        param.type = 'course';
        delete param.include;
        delete param.category_id
      } else {
        fn = api.getStudyPage
      }

      this.togglePageLoading(true);
      fn(param, (res) => {
        let pagination = res.meta.pagination;

        res.data.forEach((item, index) => {
          let course_cover = PathUtil.getFilePath(item.course_cover);
          item.course_cover = course_cover;
          item.groupId = item.id;
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
      if (item.temp_course_cover) {
        callback && callback(path);
        return;
      }

      wx.showLoading({
        title: '海报生成中...',
      });
      wx.getImageInfo({
        src: item.course_cover,
        success: (res) => {
          let path = res.path;
          this.setData({
            [`page.list[${index}].temp_course_cover`]: path
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
