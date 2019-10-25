import CommonUtil from '../../../assets/js/CommonUtil';
import PathUtil from '../../../assets/js/PathUtil';
import * as api from '../../../assets/js/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    skills: [],
    sexMap: {
      0: '男',
      1: '女'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent')
    this.setData({
      loadModalComponent
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
    this.init()
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
  init() {
    this.getUserInfo()
  },
  toggleLoading(loading) {
    this.data.loadModalComponent.setData({
      loading
    })
  },
  getUserInfo() {
    this.toggleLoading(true)
    api.getUserInfoByToken((res) => {
      let userInfo = res.data
      this.setData({
        userInfo,
        skills: JSON.parse(userInfo.info.skill_tag || '[]')
      });
    }, () => {
      this.toggleLoading(false)
    })
  },
  edit() {
    wx.navigateTo({
      url: `/pages/user/editInfo/index`
    })
  },
  toChooseSkill() {
    wx.navigateTo({
      url: `/pages/user/skill/index`
    })
  }
})