import CommonUtil from '../../../assets/js/CommonUtil';
import * as api from '../../../assets/js/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    posterUrl: null,
    beatComponent: null,
    musicComponent: null,
    tabs: [
      {
        flag: 'music',
        name: '作品'
      },
      {
        flag: 'beat',
        name: 'beat'
      }
    ],
    activeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let beatComponent = this.selectComponent('#beatComponent'),
    musicComponent = this.selectComponent('#musicComponent');

    beatComponent.setData({
      'page.showCollection': true
    });
    musicComponent.setData({
      'page.showCollection': true
    });
    this.setData({
      beatComponent,
      musicComponent
    });

    musicComponent.init(this);
    // 不显示分类
    beatComponent.setData({
      showTab: false
    });
    beatComponent.init(this);
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
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.data.beatComponent.pausePlay();
    this.data.musicComponent.pausePlay();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.beatComponent.onUnload();
    this.data.musicComponent.onUnload();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();

    let flag = this.getFlag();
    if (flag == 'music') {
      this.data.musicComponent.getPage(1);
    } else if (flag == 'beat') {
      this.data.beatComponent.getPage(1);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let flag = this.getFlag();
    if (flag == 'music') {
      this.data.musicComponent.onReachBottom();
    } else if (flag == 'beat') {
      this.data.beatComponent.onReachBottom();
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
      } else if (flag == 'beat') {
        return this.data.beatComponent.shareItem(e);
      }
    }
  },
  init() {
    let flag = this.getFlag();
    if (flag == 'music') {
      this.data.musicComponent.getPage(1);
    } else if (flag == 'beat') {
      this.data.beatComponent.getPage(1);
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

      this.data.musicComponent.pausePlay(e);
      this.data.beatComponent.pausePlay(e);
      this.init();
    }
  },
  closePoster() {
    this.setData({
      posterUrl: null
    });
  }
})