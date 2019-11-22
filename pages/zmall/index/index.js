import CommonUtil from '../../../assets/js/CommonUtil';
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 音频播放组件
    audioComponent: null,
    beatComponent: null,
    isAudient: true,
    loaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isAudient: CommonUtil.isAudient()
    })
    let beatComponent = this.selectComponent('#beatComponent')
    beatComponent.init(this);

    this.setData({
      audioComponent: beatComponent,
      beatComponent
    })

    api.getAppStatus((res) => {
      let isAudient = res.status == 1
      wx.setStorageSync('audient', isAudient)
      this.setData({
        isAudient,
        // 初始化完毕
        loaded: true
      })

      if (!isAudient) {
        let id = options.id
        if (id) {
          wx.navigateTo({
            url: `/pages/zmall/beatDetail/index?type=list&id=${id}`
          })
        }

        this.init()
      }
    })
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
    if (this.data.loaded) {
      this.init()
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
    if (!this.data.isAudient) {
      this.data.beatComponent.getPage(1);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isAudient) {
      this.data.beatComponent.onReachBottom()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    if (e.from == 'menu') {
      return CommonUtil.share()
    } else {
      return this.data.beatComponent.shareItem()
    }
  },
  init() {
    if (!this.data.isAudient) {
      let beatComponent = this.data.beatComponent
      if (!beatComponent.data.tabs.length) {
        beatComponent.getCategoryList()
      } else if (!beatComponent.data.page.list.length) {
        beatComponent.getPage(1)
      }
    }
  },
  toActivityDetail() {
    wx.navigateTo({
      url: '/pages/study/activityDetail/index'
    })
  }
})