import CommonUtil from '../../../assets/js/CommonUtil';
import TipUtil from '../../../assets/js/TipUtil';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    skills: [
      {
        text: '录音师',
        active: false
      },
      {
        text: '录音师1',
        active: false
      },
      {
        text: 'FreestyleFreestyleFreestyleFreestyleFreestyleFreestyleFreestyleFreestyleFreestyleFreestyleFreestyleFreestyleFreestyle',
        active: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(options.data || '[]')
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
  submit() {
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

    let pages = getCurrentPages()
    pages[pages.length - 2].setData({
      'userInfo.skills': skills
    })

    wx.navigateBack({
      
    })
  }
})