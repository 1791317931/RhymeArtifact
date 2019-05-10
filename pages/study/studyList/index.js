import CommonUtil from '../../../assets/js/CommonUtil';
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    activeIndex: 0,
    videoComponent: null,
    articleComponent: null,
    musicPosterComponent: null,
    onLoaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type,
    url = '',
    id = '',
    sId = '';
    
    if (options.scene) {
      decodeURIComponent(options.scene).split('&').forEach((item, index) => {
        let arr = item.split('='),
        key = arr[0],
        value = arr[1];
        if (key == 't') {
          type = value;
        } else if (key == 'id') {
          id = value;
        } else if (key == 'sId') {
          sId = value;
        }
      });
    } else {
      if (options.t) {
        type = options.t;
        id = options.id;
      }

      if (options.sId) {
        sId = options.sId;
      }
    }
    
    if (type == 'video') {
      url = '/pages/study/studyVideo/index?id=' + id;

      if (sId) {
        url += '&sectionId=' + sId;
      }
      
      wx.navigateTo({
        url
      });
    } else if (type == 'article') {
      url = '/pages/study/studyArticle/index?id=' + id;

      wx.navigateTo({
        url
      });
    }

    let videoComponent = this.selectComponent('#videoComponent'),
    articleComponent = this.selectComponent('#articleComponent'),
    musicPosterComponent = this.selectComponent('#musicPosterComponent');

    videoComponent.init(this);
    articleComponent.init(this);

    this.setData({
      videoComponent,
      articleComponent,
      musicPosterComponent
    });

    this.getCategoryList();
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
    if (!this.data.onLoaded) {
      this.setData({
        onLoaded: true
      });
      return;
    }

    let data = this.data,
    tabs = data.tabs,
    item = data.tabs[data.activeIndex],
    id = item.id || item.flag;

    if (id == tabs[tabs.length - 1].flag) {
      if (!data.articleComponent.data.page.list.length) {
        this.getPage(1);
      }
    } else {
      for (let i = 0; i < tabs.length - 1; i++) {
        if (tabs[i].id == id) {
          if (!data.articleComponent.data.page.list.length) {
            this.getPage(1);
          }
          break;
        }
      }
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
    let data = this.data,
    tabs = data.tabs,
    item = data.tabs[data.activeIndex],
    id = item.id || item.flag;

    if (id == tabs[tabs.length - 1].flag) {
      this.data.articleComponent.onReachBottom();
    } else {
      for (let i = 0; i < tabs.length - 1; i++) {
        if (tabs[i].id == id) {
          this.data.videoComponent.onReachBottom();
          break;
        }
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from == 'menu') {
      return {
        title: getApp().globalData.appName,
        path: '/pages/study/studyList/index'
      };
    } else if (e.from == 'button') {
      let item = this.data.tabs[this.data.activeIndex],
      id = item.id || item.flag;

      if (id == tabs[tabs.length - 1].flag) {
        return this.data.articleComponent.shareItem(e);
      } else {
        return this.data.videoComponent.shareItem(e);
      }
    }
  },
  getCategoryList() {
    api.getCategoryList({
      type: 1
    }, (res) => {
      let tabs = res.data;

      tabs.push({
        flag: 'article',
        name: '文章'
      });

      this.setData({
        tabs
      });

      this.getPage(1);
    });
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
    let data = this.data,
    tabs = data.tabs,
    item = data.tabs[data.activeIndex],
    id = item.id || item.flag;

    if (id == tabs[tabs.length - 1].flag) {
      this.data.articleComponent.getPage(current_page);
    } else {
      for (let i = 0; i < tabs.length - 1; i++) {
        if (tabs[i].id == id) {
          let videoComponent = this.data.videoComponent;
          videoComponent.setData({
            category_id: id
          });

          videoComponent.getPage(current_page);
          break;
        }
      }
    }
  }
})