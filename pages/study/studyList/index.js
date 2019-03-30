import StudyVideoListUtil from '../../../assets/js/components/StudyVideoListUtil';
import StudyArticleListUtil from '../../../assets/js/components/StudyArticleListUtil';
import CommonUtil from '../../../assets/js/CommonUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        flag: 'video',
        text: '视频'
      },
      {
        flag: 'article',
        text: '文章'
      }
    ],
    activeIndex: 1,
    posterUrl: '',
    downloadPoster: false,
    studyVideoPage: CommonUtil.copyObject(StudyVideoListUtil.studyVideoPage),
    studyArticlePage: CommonUtil.copyObject(StudyArticleListUtil.studyArticlePage)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.t,
    url = '';
    if (type == 'video') {
      url = '/pages/study/studyVideo/index?id=' + options.id;

      if (options.sectionId) {
        url += '&sectionId=' + options.sId;
      }
      
      wx.navigateTo({
        url
      });
    } else if (type == 'article') {
      url = '/pages/study/studyArticle/index?id=' + options.id;

      wx.navigateTo({
        url
      });
    }

    this.getPage(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let data = this.data;
    switch (data.tabs[data.activeIndex].flag) {
      case 'video':
        if (!data.studyVideoPage.list.length) {
          this.getPage(1);
        }
        break;
      case 'article':
        if (!data.studyArticlePage.list.length) {
          this.getPage(1);
        }
        break;
      default:
        break;
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    wx.vibrateShort()
    this.getPage(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let data = this.data;
    switch (data.tabs[data.activeIndex].flag) {
      case 'video':
        StudyVideoListUtil.onReachBottom(this);
        break;
      case 'article':
        StudyArticleListUtil.onReachBottom(this);
        break;
      default:
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from == 'menu') {
      return {
        title: getApp().globalData.appName,
        path: '/pages/study/studyList/index',
        success: (res) => {

        },
        fail(res) {

        },
        complete(res) {

        }
      };
    } else if (e.from == 'button') {
      let flag = this.data.tabs[this.data.activeIndex].flag;
      if (flag == 'video') {
        return StudyVideoListUtil.shareStudyVideoItem(e, this);
      } else if (flag == 'article') {
        return StudyArticleListUtil.shareStudyArticleItem(e, this);
      }
    }
  },
  toggleTab(e) {
    let index = e.target.dataset.index;
    if (index != this.data.activeIndex) {
      this.setData({
        activeIndex: index
      });
      this.getPage(1);
    }
  },
  getPage(current_page = 1) {
    let data = this.data;
    switch(data.tabs[data.activeIndex].flag) {
      case 'video':
        StudyVideoListUtil.getStudyVideoPage(current_page, this);
        break;
      case 'article':
        StudyArticleListUtil.getStudyArticlePage(current_page, this);
        break;
      default:
        break;
    }
  },
  toggleVideoCollectionItem(e) {
    StudyVideoListUtil.toggleVideoCollectionItem(e.detail, this);
  },
  clickStudyVideoItem(e) {
    StudyVideoListUtil.clickStudyVideoItem(e.detail, this);
  },
  clickStudyArticleItem(e) {
    StudyArticleListUtil.clickStudyArticleItem(e.detail, this);
  },
  generateVideoPoster(e) {
    StudyVideoListUtil.generatePoster(e.detail, this)
  },
  generateArticlePoster(e) {
    StudyArticleListUtil.generatePoster(e.detail, this)
  },
  closePoster() {
    this.setData({
      posterUrl: null
    });
  }
})