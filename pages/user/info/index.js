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
    },
    userId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent')
    let myPublishedComponent = this.selectComponent('#myPublished')

    let userId = options.userId
    if (userId) {
      myPublishedComponent.setData({
        userId
      })

      this.setData({
        userId
      })
    }

    this.setData({
      loadModalComponent,
      myPublishedComponent
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
    let component = this.data.myPublishedComponent

    this.toggleLoading(true)
    if (this.data.userId) {
      // 查看别人
      api.getUserInfoById({
        id: this.data.userId
      }, (res) => {
        let userInfo = res.data
        userInfo.avatar = PathUtil.getAvatar(userInfo.avatar)

        this.setData({
          userInfo,
          skills: JSON.parse(userInfo.info.skill_tag || '[]')
        });
        
        component.init()
      }, () => {
        this.toggleLoading(false)
      })
    } else {
      // 查看自己
      api.getUserInfoByToken((res) => {
        let userInfo = res.data
        userInfo.avatar = PathUtil.getAvatar(userInfo.avatar)
        
        this.setData({
          userInfo,
          skills: JSON.parse(userInfo.info.skill_tag || '[]')
        });

        component.setData({
          userId: userInfo.id
        })
        component.init()
      }, () => {
        this.toggleLoading(false)
      })
    }
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