import CommonUtil from '../../../assets/js/CommonUtil';
import * as api from '../../../assets/js/api';
import BAC from '../../../assets/js/components/backgroundAudio/BAC'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    tabWidth: 10000,
    activeIndex: 0,
    videoComponent: null,
    articleComponent: null,
    audioComponent: null,
    musicComponent: null,
    musicPosterComponent: null,
    onLoaded: false,
    isAudient: true
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
      url = '/pages/sub/study/studyArticle/index?id=' + id;

      wx.navigateTo({
        url
      });
    } else if (type == 'music') {
      url = '/pages/create/musicDetail/index?id=' + id;

      wx.navigateTo({
        url
      });
    }

    let musicComponent = this.selectComponent('#musicComponent')
    let videoComponent = this.selectComponent('#videoComponent')
    let articleComponent = this.selectComponent('#articleComponent')
    let musicPosterComponent = this.selectComponent('#musicPosterComponent');

    musicComponent.init(this)
    videoComponent.init(this);
    articleComponent.init(this);

    this.setData({
      isAudient: CommonUtil.isAudient()
    })
    
    this.setData({
      audioComponent: musicComponent,
      musicComponent,
      videoComponent,
      articleComponent,
      musicPosterComponent
    });

    this.getCategoryList(this.getPage);
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
    tabs = data.tabs;

    if (!this.data.tabs.length) {
      this.getCategoryList(this.renderForOnShow);
    } else {
      this.renderForOnShow();
    }

    let musicComponent = this.data.musicComponent
    if (musicComponent) {
      musicComponent.setStatus()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 只要触发hide，就默认为自动播放，避免tab之间切换，出现bug
    this.data.musicComponent.setData({
      autoPlay: true
    })
    BAC.autoPlay = true
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
    item = tabs[data.activeIndex],
    id = item.id || item.flag;

    if (item.flag == 'article') {
      this.data.articleComponent.onReachBottom();
    } else if (item.flag == 'music') {
      this.data.musicComponent.onReachBottom();
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
      let tabs = this.data.tabs,
      item = tabs[this.data.activeIndex],
      id = item.id || item.flag;

      if (item.flag == 'article') {
        return this.data.articleComponent.shareItem(e);
      } else if (item.flag == 'music') {
        return this.data.musicComponent.shareItem(e);
      } else {
        return this.data.videoComponent.shareItem(e);
      }
    }
  },
  renderForOnShow() {
    let data = this.data,
    tabs = data.tabs,
    item = tabs[data.activeIndex],
    id = item.id || item.flag;

    if (item.flag == 'article') {
      if (!data.articleComponent.data.page.list.length) {
        this.getPage(1);
      }
    } else if (item.flag == 'music') {
      let musicComponent = this.data.musicComponent
      if (!musicComponent.data.tabs.length) {
        musicComponent.getCategoryList()
      } else if (!musicComponent.data.page.list.length) {
        musicComponent.getPage(1)
      }
    } else {
      for (let i = 0; i < tabs.length - 1; i++) {
        if (tabs[i].id == id) {
          if (!data.videoComponent.data.page.list.length) {
            this.getPage(1);
          }
          break;
        }
      }
    }
  },
  getCategoryList(callback) {
    if (this.data.isAudient) {
      let tabs = []
      tabs.push({
        flag: 'article',
        name: '文章'
      });

      this.setData({
        tabs
      });
      this.setTabWidth()

      callback && callback();
    } else {
      api.getCategoryList({
        type: 5
      }, (res) => {
        let tabs = res.data;

        tabs.push({
          flag: 'article',
          name: '文章'
        });

        tabs.unshift({
          flag: 'music',
          name: '音乐'
        })

        this.setData({
          tabs
        });
        this.setTabWidth()

        callback && callback();
      });
    }
  },
  setTabWidth() {
    let query = wx.createSelectorQuery().in(this),
      that = this;
    query.selectAll('.tab-item').boundingClientRect(function (rectList) {
      let tabWidth = 0;
      for (let i = 0; i < rectList.length; i++) {
        tabWidth += Math.ceil(rectList[i].width);
      }

      that.setData({
        tabWidth
      });
    }).exec();
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

    if (item.flag == 'article') {
      this.data.articleComponent.getPage(current_page);
    } else if (item.flag == 'music') {
      let musicComponent = this.data.musicComponent
      if (!musicComponent.data.tabs.length) {
        musicComponent.getCategoryList()
      } else {
        musicComponent.getPage(current_page)
      }
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
  },
  toActivity() {
    wx.navigateTo({
      url: '/pages/study/activity/index'
    })
  }
})