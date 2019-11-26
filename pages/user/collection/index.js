import CommonUtil from '../../../assets/js/CommonUtil';
import * as api from '../../../assets/js/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    posterUrl: null,
    audioComponent: null,
    musicPosterComponent: null,
    musicComponent: null,
    videoComponent: null,
    articleComponent: null,
    tabs: [
      {
        flag: 'music',
        name: '作品'
      },
      {
        flag: 'video',
        name: '视频教程'
      },
      {
        flag: 'article',
        name: '文章'
      }
    ],
    activeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicComponent = this.selectComponent('#musicComponent'),
    videoComponent = this.selectComponent('#videoComponent'),
    articleComponent = this.selectComponent('#articleComponent'),
    musicPosterComponent = this.selectComponent('#musicPosterComponent');

    musicComponent.setData({
      'page.showType': 'myCollection'
    });
    videoComponent.setData({
      'page.showCollection': true
    });
    articleComponent.setData({
      'page.showCollection': true
    });
    musicComponent.init(this);
    videoComponent.init(this);
    articleComponent.init(this);

    this.setData({
      audioComponent: musicComponent,
      musicComponent,
      videoComponent,
      articleComponent,
      musicPosterComponent
    });

    this.init();
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
    this.data.musicComponent.setStatus()
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

    let flag = this.getFlag();
    if (flag == 'music') {
      this.data.musicComponent.getPage(1);
    } else if (flag == 'video') {
      this.data.videoComponent.getPage(1);
    } else if (flag == 'article') {
      this.data.articleComponent.getPage(1);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let flag = this.getFlag();
    if (flag == 'music') {
      this.data.musicComponent.onReachBottom();
    } else if (flag == 'video') {
      this.data.videoComponent.onReachBottom();
    } else if (flag == 'article') {
      this.data.articleComponent.onReachBottom();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from == 'menu') {
      return CommonUtil.share(e);
    } else {
      let flag = this.getFlag();
      if (flag == 'music') {
        return this.data.musicComponent.shareItem(e);
      } else if (flag == 'video') {
        return this.data.videoComponent.shareItem(e);
      } else if (flag == 'article') {
        return this.data.articleComponent.shareItem(e);
      }
    }
  },
  init() {
    let flag = this.getFlag();
    if (flag == 'music') {
      this.data.musicComponent.getPage(1);
    } else if (flag == 'video') {
      this.data.videoComponent.getPage(1);
    } else if (flag == 'article') {
      this.data.articleComponent.getPage(1);
    }
  },
  getFlag() {
    return this.data.tabs[this.data.activeIndex].flag;
  },
  toggleTab(e) {
    let activeIndex = e.target.dataset.index
    if (this.data.activeIndex != activeIndex) {
      this.setData({
        activeIndex
      });

      this.init();
    }
  },
  closePoster() {
    this.setData({
      posterUrl: null
    });
  }
})