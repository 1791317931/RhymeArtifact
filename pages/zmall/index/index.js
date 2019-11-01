import CommonUtil from '../../../assets/js/CommonUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    beatComponent: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let beatComponent = this.selectComponent('#beatComponent')
    beatComponent.init(this);

    this.setData({
      beatComponent
    })

    let id = options.id
    if (id) {
      wx.navigateTo({
        url: `/pages/zmall/beatDetail/index?type=list&id=${id}`
      })
    }
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
    let beatComponent = this.data.beatComponent
    if (!beatComponent.data.tabs.length) {
      beatComponent.getCategoryList()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 暂停播放
    this.data.beatComponent.pausePlay()
    // let that = this.data.beatComponent
    // let beat = that.data.page.list[index]
    // let BAC = that.data.BAC
    // BAC.title = beat.goods_name
    // BAC.epname = beat.goods_name
    // BAC.singer = beat.author
    // BAC.coverImgUrl = beat.cover_images[0]
    // BAC.src = beat.try_beat_url
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.beatComponent.onUnload()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.data.beatComponent.getPage(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.beatComponent.onReachBottom()
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
  }
})