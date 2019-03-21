import TipUtil from '../TipUtil';
import ConfigUtil from '../ConfigUtil';
import PathUtil from '../PathUtil';
import * as api from '../api';
import CommonUtil from '../CommonUtil';
import PosterCanvasUtil from './PosterCanvasUtil';

let StudyVideoListUtil = {
  studyVideoPage: {
    list: [],
    loading: false,
    page: 1,
    pageSize: 10,
    totalPage: 0,
    pageNum: 1
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
    PosterCanvasUtil.draw(_this, item, 'study-video');
  },
  shareStudyVideoItem(e, _this) {
    if (e.from == 'button') {
      let item = StudyVideoListUtil.getItem(e, _this),
        index = StudyVideoListUtil.getIndex(e, _this);

      // api.shareMusic({
      //   id: item.id
      // }, (res) => {
      //   if (ConfigUtil.isSuccess(res.code)) {
      //     item.share_num = item.share_num + 1;
      //     _this.setData({
      //       [`studyVideoPage.list[${index}]`]: item
      //     });
      //   } else {
      //     TipUtil.error(res.info);
      //   }
      // });

      let random = CommonUtil.getShareRandom();
      return {
        title: CommonUtil.shareRandomMsgs[random],
        imageUrl: CommonUtil.getShareImage(random),
        path: '/pages/main/index',
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
    if (page.pageNum < page.totalPage) {
      StudyVideoListUtil.getStudyVideoPage(page.pageNum + 1, _this);
    }
  },
  clickStudyVideoItem(e, _this) {
    let item = StudyVideoListUtil.getItem(e, _this);

    TipUtil.message(item.id + '')
    return;
    wx.navigateTo({
      url: '?id=' + item.id
    });
  },
  toggleStudyVideoPageLoading(loading, _this) {
    _this.setData({
      'studyVideoPage.loading': loading
    });
  },
  getStudyVideoPage(pageNum = 1, _this) {
    let page = _this.data.studyVideoPage;
    if (page.loading) {
      return;
    }

    let param = {
      page: pageNum,
      pageSize: page.pageSize
    },
      list = [];

    if (pageNum > 1) {
      list = page.list;
    }

    StudyVideoListUtil.toggleStudyVideoPageLoading(true, _this);
    _this.setData({
      'studyVideoPage.page': pageNum
    });


    setTimeout(() => {


      let obj = {};
      list = [
        {
          id: 1,
          createdBy: '张三',
          userType: 'system',
          avatorUrl: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          imageUrl: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          title: '埃米纳姆新专辑到底有多强！这是超出你想想的一件事情真的无法想象！',
          collection_num: 200,
          share_num: 100
        },
        {
          id: 2,
          createdBy: '张三2',
          userType: 'user',
          avatorUrl: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          imageUrl: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          title: '埃米纳姆新专辑到底有多强！这是超出你想想的一件事情真的无法想象！',
          collection_num: 200,
          share_num: 100
        },
        {
          id: 3,
          createdBy: '张三3',
          userType: 'system',
          imageUrl: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          title: '埃米纳姆新专辑到底有多强！这是超出你想想的一件事情真的无法想象！',
          collection_num: 200,
          share_num: 100
        },
        {
          id: 4,
          createdBy: '张三4',
          userType: 'system',
          imageUrl: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          title: '埃米纳姆新专辑到底有多强！这是超出你想想的一件事情真的无法想象！',
          collection_num: 200,
          share_num: 100
        }
      ];



      _this.setData({
        'studyVideoPage.list': list,
        'studyVideoPage.totalPage': parseInt(obj.maxPage || 0),
        'studyVideoPage.pageNum': parseInt(obj.page || 1)
      });
      _this.setData({
        'studyVideoPage.loading': false
      });
    }, 1000);
  }
};

export default StudyVideoListUtil;