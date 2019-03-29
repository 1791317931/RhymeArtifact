import TipUtil from '../TipUtil';
import ConfigUtil from '../ConfigUtil';
import PathUtil from '../PathUtil';
import * as api from '../api';
import CommonUtil from '../CommonUtil';
import PosterCanvasUtil from './PosterCanvasUtil';

let StudyArticleListUtil = {
  studyArticlePage: {
    list: [],
    loading: false,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  },
  getIndex(e, _this) {
    let index = e.target.dataset.index;
    if (isNaN(index)) {
      index = e.currentTarget.dataset.index;
    }

    return parseInt(index);
  },
  getItem(e, _this) {
    let index = StudyArticleListUtil.getIndex(e, _this);
    return _this.data.studyArticlePage.list[index];
  },
  // 下载海报
  generatePoster(e, _this) {
    let item = StudyArticleListUtil.getItem(e, _this);
    PosterCanvasUtil.draw(_this, item, 'article');
  },
  shareStudyArticleItem(e, _this) {
    if (e.from == 'button') {
      let item = StudyArticleListUtil.getItem(e, _this),
      index = StudyArticleListUtil.getIndex(e, _this);

      api.share({
        id: item.id,
        type: 'course'
      }, (res) => {
        item.share_num++;

        _this.setData({
          [`studyArticlePage.list[${index}]`]: item
        });
      });

      return {
        title: item.title,
        path: '/pages/study/studyList/index?type=article&id=' + item.id,
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
    let page = _this.data.studyArticlePage;
    if (page.current_page < page.total_pages) {
      StudyArticleListUtil.getStudyArticlePage(page.current_page + 1, _this);
    }
  },
  clickStudyArticleItem(e, _this) {
    let item = StudyArticleListUtil.getItem(e, _this);

    wx.navigateTo({
      url: '/pages/study/studyArticle/index?id=' + item.id
    });
  },
  toggleStudyArticlePageLoading(loading, _this) {
    _this.setData({
      'studyArticlePage.loading': loading
    });
  },
  getStudyArticlePage(current_page = 1, _this) {
    let page = _this.data.studyArticlePage;
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

    StudyArticleListUtil.toggleStudyArticlePageLoading(true, _this);
    let defaultImage = getApp().globalData.defaultImage;

    api.getStudyPage(param, (res) => {
      let pagination = res.meta.pagination;
      res.data.forEach((item, index) => {
        let cover = PathUtil.getFilePath(item.cover);
        item.cover = cover || defaultImage;
        StudyArticleListUtil.getPosterInfo(_this, list.length, cover);
        list.push(item);
      });

      _this.setData({
        'studyArticlePage.list': list,
        'studyArticlePage.total_pages': parseInt(pagination.total_pages || 0),
        'studyArticlePage.current_page': parseInt(pagination.current_page || 1)
      });
    }, () => {
      _this.setData({
        'studyArticlePage.loading': false
      });
    });
  },
  getPosterInfo(_this, index, url) {
    if (!url) {
      return;
    }
    
    wx.getImageInfo({
      src: url,
      success: (res) => {
        _this.setData({
          [`studyArticlePage.list[${index}].cover`]: res.path
        });
      },
      fail: (res) => {

      }
    });
  }
};

export default StudyArticleListUtil;