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
    if (page.current_page < page.total_pages) {
      StudyVideoListUtil.getStudyVideoPage(page.current_page + 1, _this);
    }
  },
  toggleVideoCollectionItem(e, _this) {
    let item = StudyVideoListUtil.getItem(e, _this),
    index = StudyVideoListUtil.getIndex(e, _this),
    studyVideoPage = _this.data.studyVideoPage;

    if (item.is_collection == 1 || studyVideoPage.showCollection) {
      api.deleteStudyVideo({
        id: item.id
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
          item.collection_num = item.collection_num - 1;
          item.is_collection = '0';

          _this.setData({
            [`studyVideoPage.list[${index}]`]: item
          });
        }
      });
    } else {
      api.collectStudyVideo({
        id: item.id
      }, (res) => {
        TipUtil.message('收藏成功');
        item.collection_num = item.collection_num + 1;
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
      per_page: page.per_page
    },
    list = [];

    if (current_page > 1) {
      list = page.list;
    }

    StudyVideoListUtil.toggleStudyVideoPageLoading(true, _this);
    _this.setData({
      'studyVideoPage.current_page': current_page
    });


    setTimeout(() => {


      let obj = {
        total_pages: 1,
        current_page: 1
      };
      list = [
        {
          id: 1,
          createdBy: '张三',
          userType: 'system',
          avatorUrl: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          videoUrl: 'https://v.qikevip.com/course/1552495672665_94270.mp4',
          poster: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          title: '埃米纳姆新专辑到底有多强！这是超出你想想的一件事情真的无法想象！',
          collection_num: 200,
          share_num: 100
        },
        {
          id: 2,
          createdBy: '张三2',
          userType: 'user',
          avatorUrl: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          videoUrl: 'https://v.qikevip.com/course/1552495826683_425859.mp4',
          poster: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          title: '埃米纳姆新专辑到底有多强！这是超出你想想的一件事情真的无法想象！',
          collection_num: 200,
          share_num: 100
        },
        {
          id: 3,
          createdBy: '张三3',
          userType: 'system',
          videoUrl: 'https://v.qikevip.com/course/1552496505028_216057.mp4',
          title: '埃米纳姆新专辑到底有多强！这是超出你想想的一件事情真的无法想象！',
          poster: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          collection_num: 200,
          share_num: 100
        },
        {
          id: 4,
          createdBy: '张三4',
          userType: 'system',
          videoUrl: 'https://v.qikevip.com/course/1552496323056_623698.mp4',
          title: '埃米纳姆新专辑到底有多强！这是超出你想想的一件事情真的无法想象！',
          poster: 'https://wx.qlogo.cn/mmopen/vi_32/rJh9HD3gjEpOT5Wicv0K59nmg08dOqdHQu4k7cjrf1wwf5XK7tBmib0V6xO2dic01rfCcqqnuJU8EZreqKKR2l3ibw/132',
          collection_num: 200,
          share_num: 100
        }
      ];


      _this.setData({
        'studyVideoPage.list': list,
        'studyVideoPage.total_pages': parseInt(obj.total_pages || 0),
        'studyVideoPage.current_page': parseInt(obj.current_page || 1)
      });
      _this.setData({
        'studyVideoPage.loading': false
      });
    }, 1000);
  }
};

export default StudyVideoListUtil;