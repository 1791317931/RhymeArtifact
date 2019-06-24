import CommonUtil from '../../../../assets/js/CommonUtil';
import TipUtil from '../../../../assets/js/TipUtil';
import * as api from '../../../../assets/js/api';
import OrderStatus from '../../../../assets/js/OrderStatus';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {
      id: null
    },
    goodsList: [],
    gift: null,
    loadModalComponent: null,
    OrderStatus,
    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent');
    loadModalComponent.init(this);
    this.setData({
      loadModalComponent
    });

    let id = options.id;
    this.setData({
      'order.id': id
    });

    this.getDetailById();
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
  toggleLoading(loading) {
    this.data.loadModalComponent.toggleLoading(loading);
  },
  getDetailById() {
    let id = this.data.order.id;

    this.toggleLoading(true);
    api.getOrderById({
      id
    }, (res) => {
      let order = res.data.order
      let goodsList = res.data.goodsInfo || []
      let OrderStatus = this.data.OrderStatus;
      let status = order.order_status;
      if (status == OrderStatus.NEED_PAY) {
        status = '待支付';
      } else if (status == OrderStatus.HAS_PAY) {
        status = '已支付';
      } else if (status == OrderStatus.CANCEL_PAY) {
        status = '已取消';
      } else if (status == OrderStatus.TIMEOUT) {
        status = '支付超时';
      }
      this.setData({
        order,
        goodsList,
        status
      });
    }, () => {
      this.toggleLoading(false);
    })
  },
  toPay() {
    let orderId = this.data.order.id;

    this.toggleLoading(true)
    api.payOrderAgain({
      orderId
    }, (res) => {
      let data = res.data,
      packageParam = data.package;

      wx.requestPayment({
        ...packageParam,
        success: (res) => {
          TipUtil.success('购买成功')
          let pages = getCurrentPages()
          pages[pages.length - 2].getPage(1)

          setTimeout(() => {
            wx.navigateBack({

            })
          }, 1000)
        },
        fail: (res) => {
          if (ConfigUtil.isDev()) {
            wx.showModal({
              title: 'x',
              content: '' + JSON.stringify(res),
            });
          } else {
            if (!/cancel/.test(res.errMsg || '')) {
              TipUtil.error('支付失败');
            }
          }
        }
      });
    }, () => {
      this.toggleLoading(false)
    })
  },
  goToProduct() {
    let productId = this.data.goodsList[0].id;
    wx.navigateTo({
      url: `/pages/mall/beatDetail/index?id=${productId}`
    });
  }
})