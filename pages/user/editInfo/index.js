import CommonUtil from '../../../assets/js/CommonUtil';
import TimeUtil from '../../../assets/js/TimeUtil'
import TipUtil from '../../../assets/js/TipUtil'
import PathUtil from '../../../assets/js/PathUtil'
import * as api from '../../../assets/js/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    loading: false,
    loadModalComponent: null,
    endDate: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent')
    this.setData({
      loadModalComponent,
      endDate: TimeUtil.getFormatTime(new Date(), 'yyyy-mm-dd')
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
  onShareAppMessage: function () {
    return CommonUtil.share(e);
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
    }, () => {
      this.toggleLoading(false)
    })
  },
  toUpload() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        let path = res.tempFilePaths[0]

        this.toggleLoading(true)
        CommonUtil.getPolicyParam((data) => {
          let key = data.getKey('img', path)
          let host = data.host;

          // 上传
          wx.uploadFile({
            url: host,
            // 本地文件路径
            filePath: path,
            name: 'file',
            formData: {
              OSSAccessKeyId: data.OSSAccessKeyId,
              policy: data.policy,
              signature: data.signature,
              key,
              success_action_status: '200'
            },
            success: (res) => {
              let avatar = host + '/' + key
              this.save({
                type: 'avatar',
                avatar
              }, (res) => {
                let userInfo = wx.getStorageSync('userInfo')
                userInfo.avatar = avatar
                wx.setStorageSync('userInfo', userInfo)
                this.setData({
                  'user.avatar': avatar
                })
              })
            },
            fail: (res) => {
              this.toggleLoading(false);
              TipUtil.message('服务器繁忙，请稍后重试');
            }
          }, null, () => {
            this.toggleLoading(false);
          });
        });
      }
    })
  },
  changeNickname(e) {
    this.setData({
      'user.nickname': e.detail.value.trim()
    });
  },
  changeDesc(e) {
    this.setData({
      'user.info.introduce': e.detail.value.trim()
    });
  },
  changeTeam(e) {
    this.setData({
      'user.info.team': e.detail.value.trim()
    });
  },
  changeSchool(e) {
    this.setData({
      'user.info.school': e.detail.value.trim()
    });
  },
  submit(e) {
    let user = this.data.user
    let info = this.data.user.info

    if (!info.introduce.trim()) {
      TipUtil.warning('请填写用户名')
      return
    }

    this.save({
      nickname: user.nickname,
      introduce: info.introduce,
      team: info.team,
      school: info.school,
      skill_tag: info.skill_tag,
      // 修改用户信息
      type: 'info'
    }, (res) => {
      wx.setStorageSync('userInfo', user)
      wx.navigateBack({
        
      })
    })
  },
  save(data, callback) {
    if (this.data.loading) {
      return
    }

    this.toggleLoading(true)
    api.updateUser(data, (res) => {
      callback(res)
    }, () => {
      this.toggleLoading(false)
    })
  }
})