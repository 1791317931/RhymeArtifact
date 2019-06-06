import CommonUtil from '../../../../assets/js/CommonUtil';
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
    setTimeout(() => {
      let order = {
        id,
        code: '#C0009443F',
        status: 0,
        product_id: 1,
        products: [
          {
            id: 1,
            name: 'old school beat',
            cover: '/assets/imgs/logo.png',
            author: '今晚吃鱼丸',
            price: 298,
            type: 'beat独家包分轨'
          }
        ],
        presents: [
          {
            id: 1,
            name: '棒球帽子',
            cover: '/assets/imgs/logo.png',
            color: '白色',
            price: 0,
            count: 1
          }
        ],
        address: {
          receiver: '金光旭',
          phone: '17701050044',
          address: '北京市 昌平区 回龙观 新龙城小区27号楼7单元101室',
          email: '邮箱：NPCAKA@163.COM'
        }
      }
      let OrderStatus = this.data.OrderStatus;
      let status = order.status;
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
        status
      });
      this.toggleLoading(false);
    }, 1000);
  },
  toPay() {
    let productId = this.data.order.product_id;
  },
  goToProduct() {
    let productId = this.data.order.product_id;
    wx.navigateTo({
      url: `/pages/mall/beatDetail/index?id=${productId}`
    });
  }
})