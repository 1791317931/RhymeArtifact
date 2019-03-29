import TipUtil from '../TipUtil';
import ConfigUtil from '../ConfigUtil';
import PathUtil from '../PathUtil';
import * as api from '../api';
import PosterCanvasUtil from './PosterCanvasUtil';

let StudyVideoListUtil = {
  studyVideoPage: {
    list: [],
    loading: false,
    page: 1,
    per_page: 10,
    total_pages: 0,
    current_page: 1
  },
  getIndex(e, _this) {
    let index = e.target.dataset.index;
    if (isNaN(index)) {
      index = e.currentTarget.dataset.index;
    }

    return parseInt(index);
  },
  getItem(e, _this) {
    let index = StudyVideoListUtil.getIndex(e, _this);
    return _this.data.studyVideoPage.list[index];
  },
  // 下载海报
  generatePoster(e, _this) {
    let item = StudyVideoListUtil.getItem(e, _this);
    PosterCanvasUtil.draw(_this, item, 'video');
  },
  shareStudyVideoItem(e, _this) {
    if (e.from == 'button') {
      let item = StudyVideoListUtil.getItem(e, _this),
      index = StudyVideoListUtil.getIndex(e, _this);

      api.share({
        id: item.id,
        type: 'course'
      }, (res) => {
        item.share_num++;
        _this.setData({
          [`studyVideoPage.list[${index}]`]: item
        });
      });

      return {
        title: item.course_title,
        path: '/pages/study/studyVideo/index?type=video&id=' + item.id,
        success: (res) => {

        },
        fail(res) {

        },
        complete(res) {

        }
      };
    }
  },
  onReachBottom(_this) {
    let page = _this.data.studyVideoPage;
    if (page.current_page < page.total_pages) {
      StudyVideoListUtil.getStudyVideoPage(page.current_page + 1, _this);
    }
  },
  toggleVideoCollectionItem(e, _this) {
    let item = StudyVideoListUtil.getItem(e, _this),
    index = StudyVideoListUtil.getIndex(e, _this),
    studyVideoPage = _this.data.studyVideoPage,
    type = 'course';

    if (item.is_collection == 1 || studyVideoPage.showCollection) {
      api.deleteCollection({
        id: item.id,
        type
      }, (res) => {
        TipUtil.message('已取消收藏');

        // 显示我的收藏，把被取消收藏的创作去掉
        if (_this.data.studyVideoPage.showCollection) {
        let list = studyVideoPage.list;
        list.splice(index, 1);

          _this.setData({
            'studyVideoPage.list': list
          });
        } else {
          item.collection_num--;
          item.is_collection = '0';

          _this.setData({
            [`studyVideoPage.list[${index}]`]: item
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
        item.is_collection = '1';

        _this.setData({
          [`studyVideoPage.list[${index}]`]: item
        });
      });
    }
  },
  clickStudyVideoItem(e, _this) {
    let item = StudyVideoListUtil.getItem(e, _this);

    wx.navigateTo({
      url: '/pages/study/studyVideo/index?id=' + item.id
    });
  },
  toggleStudyVideoPageLoading(loading, _this) {
    _this.setData({
      'studyVideoPage.loading': loading
    });
  },
  getStudyVideoPage(current_page = 1, _this) {
    let page = _this.data.studyVideoPage;
    if (page.loading) {
      return;
    }

    let param = {
      page: current_page,
      per_page: page.per_page,
      type: 'courses',
      include: 'author',
      hasCollection: 1
    },
    list = [];

    if (current_page > 1) {
      list = page.list;
    }

    StudyVideoListUtil.toggleStudyVideoPageLoading(true, _this);
    api.getStudyPage(param, (res) => {
      let pagination = res.meta.pagination;
      res.data.forEach((item, index) => {
        item.course_cover = PathUtil.getFilePath(item.course_cover);
        StudyVideoListUtil.getPosterInfo(_this, list.length, item.course_cover);
        item.groupId = item.id;
        list.push(item);
      });

      _this.setData({
        'studyVideoPage.list': list,
        'studyVideoPage.total_pages': parseInt(pagination.total_pages || 0),
        'studyVideoPage.current_page': parseInt(pagination.current_page || 1)
      });
    }, () => {
      _this.setData({
        'studyVideoPage.loading': false
      });
    });
  },
  getPosterInfo(_this, index, url) {
    wx.getImageInfo({
      src: url,
      success: (res) => {
        _this.setData({
          [`studyVideoPage.list[${index}].course_cover`]: res.path
        });
      },
      fail: (res) => {
        
      }
    });
  }
};

export default StudyVideoListUtil;