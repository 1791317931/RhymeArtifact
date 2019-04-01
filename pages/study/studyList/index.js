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
    videoComponent: null,
    articleComponent: null
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

    let videoComponent = this.selectComponent('#videoComponent'),
    articleComponent = this.selectComponent('#articleComponent');

    videoComponent.init(this);
    articleComponent.init(this);

    this.setData({
      videoComponent,
      articleComponent
    });
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
        if (!data.videoComponent.data.page.list.length) {
          this.getPage(1);
        }
        break;
      case 'article':
        if (!data.articleComponent.data.page.list.length) {
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
        this.data.videoComponent.onReachBottom();
        break;
      case 'article':
        this.data.articleComponent.onReachBottom();
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
        return this.data.videoComponent.shareItem(e);
      } else if (flag == 'article') {
        return this.data.articleComponent.shareItem(e);
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
        this.data.videoComponent.getPage(current_page);
        break;
      case 'article':
        this.data.articleComponent.getPage(current_page);
        break;
      default:
        break;
    }
  },
  closePoster() {
    this.setData({
      posterUrl: null
    });
  }
})