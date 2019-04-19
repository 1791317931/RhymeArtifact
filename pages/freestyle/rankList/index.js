import TipUtil from '../../../assets/js/TipUtil';
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        flag: '',
        text: '声量榜'
      }
    ],
    // tabs: [
    //   {
    //     flag: 'week',
    //     text: '周榜'
    //   },
    //   {
    //     flag: 'latest',
    //     text: '最新'
    //   },
    //   {
    //     flag: 'hot',
    //     text: '热度'
    //   }
    // ],
    activeIndex: 0,
    voiceRankComponent: null,
    weekRankComponent: null,
    latestRankComponent: null,
    hotRankComponent: null,
    topRankList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let weekRankComponent = this.selectComponent('#weekRankComponent'),
    // latestRankComponent = this.selectComponent('#latestRankComponent'),
    // hotRankComponent = this.selectComponent('#hotRankComponent');

    let voiceRankComponent = this.selectComponent('#voiceRankComponent');

    this.setData({
      // weekRankComponent,
      // latestRankComponent,
      // hotRankComponent
      voiceRankComponent
    });

    voiceRankComponent.init(this);
    // weekRankComponent.init(this);
    // latestRankComponent.init(this);
    // hotRankComponent.init(this);
    // this.getPage(1);
    voiceRankComponent.getTopRankList(1);
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
    this.data.voiceRankComponent.getTopRankList(1);
    // this.getPage(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // let data = this.data,
    // activeIndex = data.activeIndex,
    // tabs = data.tabs;

    // switch (tabs[activeIndex].flag) {
    //   case 'week':
    //     this.data.weekRankComponent.onReachBottom();
    //     break;
    //   case 'latest':
    //     this.data.latestRankComponent.onReachBottom();
    //     break;
    //   case 'hot':
    //     this.data.hotRankComponent.onReachBottom();
    //     break;
    // }

    this.data.voiceRankComponent.onReachBottom();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
  // getPage(pageNum = 1) {
  //   let data = this.data,
  //   flag = data.tabs[data.activeIndex].flag;

  //   // 需要设置参数
  //   if (flag === 'week') {
  //     data.weekRankComponent.getPage(1);
  //   } else if (flag === 'latest') {
  //     data.latestRankComponent.setType(flag);
  //     data.latestRankComponent.getPage(1);
  //   } else if (flag === 'hot') {
  //     data.hotRankComponent.setType(flag);
  //     data.hotRankComponent.getPage(1);
  //   }
  // },
  setTopRank(e) {
    let topRankList = e.detail;
    this.setData({
      topRankList
    });

    if (!topRankList.length) {
      TipUtil.message('当前还没有任何作品');
    }
  },
  getIndex(e) {
    let index = e.target.dataset.index;
    if (isNaN(index)) {
      index = e.currentTarget.dataset.index;
    }

    return parseInt(index);
  },
  getItem(e) {
    let index = this.getIndex(e);
    return this.data.topRankList[index];
  },
  clickRankItem(e) {
    let item = this.getItem(e);
    wx.navigateTo({
      url: `/pages/freestyle/play/index?id=${item.freestyle_id}&userId=${item.user_id}`
    });
  },
  pick(e) {
    let item = this.getItem(e);
    api.addFreestylePick({
      id: item.freestyle_id
    }, () => {
      TipUtil.success('投票成功');
      this.setData({
        [`page.topRankList[${this.getIndex(e)}].pick_num`]: ++item.pick_num
      });
    });
  }
})