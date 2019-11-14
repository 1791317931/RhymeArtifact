import CommonUtil from '../../../assets/js/CommonUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        flag: 'beat',
        name: '伴奏作品'
      },
      {
        flag: 'music',
        name: '音乐作品'
      }
    ],
    activeIndex: 0,
    beatComponent: null,
    musicComponent: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let beatComponent = this.selectComponent('#beatComponent')
    let musicComponent = this.selectComponent('#musicComponent')

    beatComponent.setData({
      showCategory: false
    })
    musicComponent.setData({
      showCategory: false
    })
    beatComponent.init(this);
    musicComponent.init(this)
    
    this.setData({
      beatComponent,
      musicComponent
    })

    this.getPage(1)
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
    this.data.musicComponent.pausePlay()
    this.data.beatComponent.pausePlay();
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
      id = item.flag;

    if (item.flag == 'beat') {
      this.data.beatComponent.onReachBottom();
    } else if (item.flag == 'music') {
      this.data.musicComponent.onReachBottom();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from == 'menu') {
      return CommonUtil.share()
    } else if (e.from == 'button') {
      let tabs = this.data.tabs,
        item = tabs[this.data.activeIndex],
        id = item.flag;

      if (item.flag == 'beat') {
        return this.data.beatComponent.shareItem(e);
      } else if (item.flag == 'music') {
        return this.data.musicComponent.shareItem(e);
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
    this.data.beatComponent.pausePlay();
    this.data.musicComponent.pausePlay();
    let data = this.data,
      tabs = data.tabs,
      item = data.tabs[data.activeIndex],
      id = item.flag;

    if (id == 'music') {
      let musicComponent = this.data.musicComponent
      musicComponent.getPage(current_page)
    } else if (id == 'beat') {
      let beatComponent = this.data.beatComponent
      beatComponent.getPage(current_page)
    }
  },
  toActivityDetail() {
    wx.navigateTo({
      url: '/pages/study/activityDetail/index'
    })
  }
})