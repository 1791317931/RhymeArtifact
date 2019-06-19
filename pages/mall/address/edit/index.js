import CommonUtil from '../../../../assets/js/CommonUtil';
import TipUtil from '../../../../assets/js/TipUtil';
import * as api from '../../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      id: null,
      name: '',
      area: '',
      address: '',
      phone: '',
      isDefault: 1
    },
    loadModal: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModal = this.selectComponent('#loadModal');
    loadModal.init(this);

    this.setData({
      loadModal
    });
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
  toggleCheckbox() {
    let isDefault = this.data.form.isDefault;
    if (isDefault) {
      isDefault = 0;
    } else {
      isDefault = 1;
    }
    this.setData({
      'form.isDefault': isDefault
    });
  },
  toggleLoading(loading) {
    this.data.loadModal.toggleLoading(loading);
  },
  save(e) {
    let valueObj = e.detail.value,
    name = valueObj.name.trim(),
    area = valueObj.area.trim(),
    address = valueObj.address.trim(),
    phone = valueObj.phone.trim(),
    form = this.data.form,
    isDefault = form.isDefault;

    if (!name.length) {
      TipUtil.message('请填写姓名');
      return;
    }

    if (!area.length) {
      TipUtil.message('请填写地区');
      return;
    }

    if (!address.length) {
      TipUtil.message('请填写详细地址');
      return;
    }

    if (!phone.length) {
      TipUtil.message('请填写手机号');
      return;
    } else if (!/^1\d{10}/.test(phone)) {
      TipUtil.message('请填写正确格式的手机号');
      return;
    }

    form = {
      receiver: name,
      area,
      detail_info: address,
      tel_number: phone,
      isDefault
    };

    this.toggleLoading(true)
    api.addAddress(form, (res) => {
      TipUtil.success('操作成功')
      setTimeout(() => {
        wx.navigateBack({
          
        });
      }, 500)
    }, () => {
      this.toggleLoading(false)
    })
  }
})