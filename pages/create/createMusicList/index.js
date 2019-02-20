import CreateMusicListUtil from '../../../assets/js/CreateMusicListUtil';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    createMusicPage: {
      list: [
        {
          id: 1,
          title: 'Tarp风格beat',
          // 时长
          duration: '03:28',
          composer: '金光旭',
          playing: false
        },
        {
          id: 2,
          title: '当你走的45天',
          // 时长
          duration: '03:28',
          composer: '金光旭',
          playing: false
        },
        {
          id: 3,
          title: 'Tarp风格beat',
          // 时长
          duration: '03:28',
          composer: '金光旭',
          playing: false
        },
        {
          id: 4,
          title: '当你走的45天',
          // 时长
          duration: '03:28',
          composer: '金光旭',
          playing: false
        }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  toggleMusicItemStatus(e) {
    CreateMusicListUtil.toggleMusicItemStatus(e, this);
  },
  clickCollectionItem(e) {
    CreateMusicListUtil.clickCollectionItem(e, this);
  },
  toRecord(e) {
    CreateMusicListUtil.toRecord(e);
  }
})