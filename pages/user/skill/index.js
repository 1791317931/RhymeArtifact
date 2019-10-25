import CommonUtil from '../../../assets/js/CommonUtil';
import TipUtil from '../../../assets/js/TipUtil';
import * as api from '../../../assets/js/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    loadModalComponent: null,
    user: null,
    skills: [
      {
        text: '录音师',
        active: false
      },
      {
        text: '混音师',
        active: false
      },
      {
        text: '母带师',
        active: false
      },
      {
        text: '作词',
        active: false
      },
      {
        text: '编曲',
        active: false
      },
      {
        text: 'rapper',
        active: false
      },
      {
        text: 'Trap',
        active: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent')
    this.setData({
      loadModalComponent
    })
    this.getUserInfo()
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
  getIndex(e) {
    let index = e.target.dataset.index;
    if (isNaN(index)) {
      index = e.currentTarget.dataset.index;
    }

    return parseInt(index);
  },
  getItem(e) {
    let index = this.getIndex(e);
    return this.data.skills[index];
  },
  clickItem(e) {
    let skills = this.data.skills
    skills[this.getIndex(e)].active = !skills[this.getIndex(e)].active
    this.setData({
      skills
    })
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
        user: userInfo
      });
      this.setSkill(userInfo)
    }, () => {
      this.toggleLoading(false)
    })
  },
  setSkill(userInfo) {
    let data = JSON.parse(userInfo.info.skill_tag || '[]')

    let skills = this.data.skills
    let skill
    data.forEach(item => {
      let exit = false
      for (let i = 0; i < skills.length; i++) {
        skill = skills[i]
        if (skill.text == item) {
          skill.active = exit = true
          break
        }
      }

      // 如果系统没有，添加到数组
      if (!exit) {
        skills.push({
          text: item,
          active: false
        })
      }
    })

    this.setData({
      skills
    })
  },
  submit() {
    if (this.data.loading) {
      return
    }

    let skills = this.data.skills.filter(item => {
      if (item.active) {
        return true
      }
    }).map(item => {
      return item.text
    })

    if (!skills.length) {
      TipUtil.message('请至少选择一个技能')
      return
    } else if(skills.length > 3) {
      TipUtil.message('最多选择3个技能')
      return
    }

    let skill_tag = JSON.stringify(skills)
    this.toggleLoading(true)
    let user = this.data.user
    let info = user.info
    api.updateUser({
      nickname: user.nickname,
      introduce: info.introduce,
      team: info.team,
      school: info.school,
      skill_tag,
      type: 'info'
    }, (res) => {
      user.info.skill_tag = skill_tag
      wx.setStorageSync('userInfo', user)

      wx.navigateBack({

      })
    }, () => {
      this.toggleLoading(false)
    })
  }
})