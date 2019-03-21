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
    activeIndex: 0,
    posterUrl: '',
    studyVideoPage: CommonUtil.copyObject(StudyVideoListUtil.studyVideoPage),
    studyArticlePage: CommonUtil.copyObject(StudyArticleListUtil.studyArticlePage)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      return CommonUtil.shareApp(e);
    } else {
      return StudyArticleListUtil.shareStudyArticleItem(e, this);
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
  generatePoster(e) {
    StudyArticleListUtil.generatePoster(e.detail, this)
  },
  closePoster() {
    this.setData({
      posterUrl: null
    });
  },
  getPage(pageNum = 1) {
    let data = this.data;
    switch(data.tabs[data.activeIndex].flag) {
      case 'video':
        StudyVideoListUtil.getStudyVideoPage(pageNum, this);
        break;
      case 'article':
        StudyArticleListUtil.getStudyArticlePage(pageNum, this);
        break;
      default:
        break;
    }
  },
  clickStudyArticleItem(e) {
    StudyArticleListUtil.clickStudyArticleItem(e.detail, this);
  }
})