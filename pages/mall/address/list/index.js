import CommonUtil from '../../../../assets/js/CommonUtil';
import TipUtil from '../../../../assets/js/TipUtil';
import * as api from '../../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressComponent: null,
    // 进入该页面时，是否可以选中某个选项
    forChoose: false,
    loadModal: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let addressComponent = this.selectComponent('#addressComponent'),
    loadModal = this.selectComponent('#loadModal')
    loadModal.init(this)

    this.setData({
      addressComponent,
      loadModal
    });
    addressComponent.init(this);

    if (options.forChoose) {
      addressComponent.setData({
        forChoose: true
      });
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
    wx.stopPullDownRefresh();
    this.data.addressComponent.getPage(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.addressComponent.onReachBottom();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    return CommonUtil.share(e);
  },
  toggleLoading(loading) {
    this.data.loadModal.toggleLoading(loading)
  },
  addAddress() {
    wx.chooseAddress({
      success: (res) => {
        let receiver = res.userName,
        tel_number = res.telNumber,
        postal_code = res.postalCode,
        province_name = res.provinceName,
        city_name = res.cityName,
        county_name = res.countyName,
        detail_info = res.detailInfo,
        national_code = res.nationalCode

        this.toggleLoading(true)
        api.addAddress({
          receiver,
          tel_number,
          postal_code,
          province_name,
          city_name,
          county_name,
          detail_info,
          national_code
        }, (res) => {
          TipUtil.success('操作成功')
          this.data.addressComponent.getPage(1)
        }, () => {
          this.toggleLoading(false)
        })
      }
    })
  }
})