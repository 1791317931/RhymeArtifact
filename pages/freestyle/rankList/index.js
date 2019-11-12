import CommonUtil from '../../../assets/js/CommonUtil';
import TipUtil from '../../../assets/js/TipUtil';
import TimeUtil from '../../../assets/js/TimeUtil';
import DateUtil from '../../../assets/js/DateUtil';
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      // {
      //   flag: 'week',
      //   text: '周榜'
      // },
      {
        flag: 'latest',
        text: '最新'
      },
      {
        flag: 'hot',
        text: '热度'
      }
    ],
    activeIndex: 0,
    popImageComponent: null,
    activityRankList: null,
    latestRankComponent: null,
    hotRankComponent: null,
    topRankList: [],
    endTimeArr: [],
    // setTimeout是否可以循环
    cycleAble: true,
    // 前三名不在组建中，需要全局控制
    picking: false,
    rankListBg: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let activityRankList = this.selectComponent('#activityRankList');
    let latestRankComponent = this.selectComponent('#latestRankComponent');
    let popImageComponent = this.selectComponent('#popImageComponent');
    let hotRankComponent = this.selectComponent('#hotRankComponent');

    this.setData({
      popImageComponent,
      activityRankList,
      latestRankComponent,
      hotRankComponent
    });

    this.getActivitySetting();
    activityRankList.init(this);
    latestRankComponent.init(this);
    hotRankComponent.init(this);
    hotRankComponent.setType('hot');

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
    let app = getApp(),
    activity = app.globalData.activity;

    if (activity) {
      this.setData({
        rankListBg: activity.details_img
      });
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
    this.setData({
      cycleAble: false
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.getPage(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let data = this.data,
    activeIndex = data.activeIndex,
    tabs = data.tabs;

    switch (tabs[activeIndex].flag) {
      case 'week':
        this.data.activityRankList.onReachBottom();
        break;
      case 'latest':
        this.data.latestRankComponent.onReachBottom();
        break;
      case 'hot':
        this.data.hotRankComponent.onReachBottom();
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return CommonUtil.share();
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
  getActivitySetting() {
    let app = getApp(),
    activity = app.globalData.activity;

    if (activity) {
      // this.setData({
      //   [`tabs[0].text`]: activity.activity_name
      // });

      let currentTime = activity.current_time,
      endTime = activity.end_time;

      let caculateTime = () => {
        let diffTime = Math.max(0, endTime - currentTime);

        let arr = TimeUtil.numberToArr(diffTime),
          days = parseInt(arr[0] / 24),
          hours = arr[0] % 24;

        let endTimeArr = [days, hours, arr[1], arr[2]].map((item) => {
          item = parseInt(item);

          if (item < 10) {
            return '0' + item;
          } else {
            return item;
          }
        });
        this.setData({
          endTimeArr
        });

        if (diffTime < 0 || !this.data.cycleAble) {
          return;
        }

        setTimeout(() => {
          currentTime++;
          caculateTime();
        }, 1000);
      };
      caculateTime();
    }
  },
  getPage(pageNum = 1) {
    let data = this.data,
    flag = data.tabs[data.activeIndex].flag;

    // 需要设置参数
    if (flag === 'week') {
      data.activityRankList.getPage(pageNum);
    } else if (flag === 'latest') {
      data.latestRankComponent.getPage(pageNum);
    } else if (flag === 'hot') {
      data.hotRankComponent.getPage(pageNum);
    }
  },
  setTopRank(e) {
    let topRankList = e.detail;
    this.setData({
      topRankList
    });
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
  togglePicking(picking) {
    this.setData({
      picking
    });
  },
  pick(e) {
    if (this.data.picking) {
      TipUtil.message('正在投票中，请稍后');
      return;
    }

    this.togglePicking(true);
    let item = this.getItem(e);
    api.addFreestylePick({
      id: item.freestyle_id
    }, (res) => {
      let img = res.data && res.data.cover;
      if (img) {
        this.data.popImageComponent.showImg(img);
      }
      
      TipUtil.success('投票成功');
      this.setData({
        [`topRankList[${this.getIndex(e)}].pick_num`]: ++item.pick_num
      });
    }, () => {
      this.togglePicking(false);
    });
  }
})