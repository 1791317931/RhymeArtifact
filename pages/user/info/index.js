import CommonUtil from '../../../assets/js/CommonUtil';
import PathUtil from '../../../assets/js/PathUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    userInfo.avatarUrl = PathUtil.getFilePath(userInfo.avatarUrl);
    this.setData({
      userInfo: {
        ...userInfo,
        skills: ['编曲', '录音师', 'Trap'],
        brand: 'PAL',
        sex: '男',
        school: '北京现代音乐学院'
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
  onShareAppMessage: function (e) {
    return CommonUtil.share(e);
  },
  edit() {
    wx.navigateTo({
      url: `/pages/user/editInfo/index?data=${JSON.stringify(this.data.userInfo)}`
    })
  },
  toChooseSkill() {
    wx.navigateTo({
      url: `/pages/user/skill/index?data=${JSON.stringify(this.data.userInfo.skills)}`
    })
  }
})