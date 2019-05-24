import CommonUtil from '../../../assets/js/CommonUtil';
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        flag: 'beat',
        name: 'Beat'
      },
      {
        flag: 'round',
        name: '周边'
      }
    ],
    activeIndex: 0,
    beatTypeComponent: null,
    roundComponent: null,
    onLoaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let beatTypeComponent = this.selectComponent('#beatTypeComponent'),
    roundComponent = this.selectComponent('#roundComponent');

    beatTypeComponent.init(this);
    roundComponent.init(this);

    this.setData({
      beatTypeComponent,
      roundComponent
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
    if (!this.data.onLoaded) {
      this.setData({
        onLoaded: true
      });
      return;
    }
    this.getPage(1, true);
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
    item = tabs[data.activeIndex],
    flag = item.flag;

    if (flag == 'beat') {
      this.data.beatTypeComponent.onReachBottom();
    } else if (flag == 'round') {
      this.data.roundComponent.onReachBottom();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: getApp().globalData.appName,
      path: '/pages/mall/index/index'
    };
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
  // forShow = true onShow调用
  getPage(current_page = 1, forShow = false) {
    let data = this.data,
    tabs = data.tabs,
    item = tabs[data.activeIndex],
    flag = item.flag;

    if (flag == 'beat') {
      let beatTypeComponent = data.beatTypeComponent;
      if (forShow) {
        if (!beatTypeComponent.data.page.list.length) {
          beatTypeComponent.getPage(1);
        }
      } else {
        beatTypeComponent.getPage(1);
      }
    } else if (flag == 'round') {
      let roundComponent = data.roundComponent;
      if (forShow) {
        if (!roundComponent.data.page.list.length) {
          roundComponent.getPage(1);
        }
      } else {
        roundComponent.getPage(1);
      }
    }
  }
})