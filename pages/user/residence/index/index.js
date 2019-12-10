import CommonUtil from '../../../../assets/js/CommonUtil';
import TipUtil from '../../../../assets/js/TipUtil'
import PathUtil from '../../../../assets/js/PathUtil'
import * as api from '../../../../assets/js/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    descArr: [
      '请拍摄并上传文字清晰、身份证四角齐全、有效期 内的身份证原件。不模糊、遮盖，无反光。',
      '海外用户上传自己合法证件(护照、身份证件)即可。',
      '身份认证信息仅用于“提现”功能使用；认证信息映客会严格保密。'
    ],
    form: {
      true_name: '',
      idcard_no: '',
      idcard_front: '',
      idcard_behind: ''
    },
    loadModalComponent: null,
    loading: false
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
  changeName(e) {
    this.setData({
      'form.true_name': e.detail.value.trim()
    });
  },
  changeCardNo(e) {
    this.setData({
      'form.idcard_no': e.detail.value.trim()
    });
  },
  toUploadFrontCard(e) {
    this.toUpload('front')
  },
  toUploadBackCard(e) {
    this.toUpload('back')
  },
  toggleLoading(loading) {
    this.data.loadModalComponent.setData({
      loading
    })
  },
  toUpload(type) {
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
              if (type == 'front') {
                this.setData({
                  'form.idcard_front': avatar
                })
              } else {
                this.setData({
                  'form.idcard_behind': avatar
                })
              }
              this.toggleLoading(false)
            },
            fail: (res) => {
              this.toggleLoading(false);
              TipUtil.message('服务器繁忙，请稍后重试');
            }
          }, null, () => {
            this.toggleLoading(false)
          });
        });
      }
    })
  },
  submit(e) {
    let form = this.data.form

    if (!form.true_name.trim()) {
      TipUtil.warning('请填写用户名')
      return
    }

    let idcard_no = form.idcard_no.trim()
    if (!idcard_no) {
      TipUtil.warning('请填写身份证号')
      return
    } else if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idcard_no)) {
      TipUtil.warning('请填写正确格式身份证号')
      return
    }

    this.toggleLoading(true)
    api.settled(form, (res) => {
      wx.redirectTo({
        url: '/pages/user/residence/success/index'
      })
    }, () => {
      this.toggleLoading(false)
    })
  }
})