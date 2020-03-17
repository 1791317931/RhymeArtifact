import TimeUtil from '../../../assets/js/TimeUtil'
import TipUtil from '../../../assets/js/TipUtil'
import CommonUtil from '../../../assets/js/CommonUtil'
import ConfigUtil from '../../../assets/js/ConfigUtil'
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIos: false,
    id: null,
    beat: {},
    loading: false,
    loadModalComponent: null,
    skuMap: {
      1: {
        title: '标准MP3租赁',
        format: 'MP3格式音频'
      },
      2: {
        title: '高级WAV租赁',
        format: 'MP3和WAV格式音频'
      },
      3: {
        title: '分轨音频租赁',
        format: 'MP3、WAV和分轨格式音频文件'
      },
      4: {
        title: '独家买断',
        format: 'MP3、WAV和分轨格式音频文件'
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent')
    this.setData({
      loadModalComponent,
      id: options.id,
      isIos: getApp().globalData.platform == 'ios'
    })

    this.getById()
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

  },
  toggleLoading(loading) {
    this.data.loadModalComponent.setData({
      loading
    })
  },
  getById() {
    this.toggleLoading(true)
    api.getGoodsById({
      id: this.data.id
    }, (res) => {
      let beat = res.data
      beat.goods_skus.forEach(item => {
        item.price = new Number(item.price).toFixed(2)
      })
      this.setData({
        beat
      })
    }, () => {
      this.toggleLoading(false)
    })
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
    return this.data.beat.goods_skus[index];
  },
  clickItem(e) {
    let index = this.getIndex(e)
    let beat = this.data.beat
    beat.goods_skus[index].open = !beat.goods_skus[index].open
    this.setData({
      beat
    })
  },
  copyUrl() {
    wx.setClipboardData({
      data: `https://peaceandlovemusic.cn/#/beat/detail?id=${this.data.id}`
    })
  },
  buy(e) {
    // if (this.data.isIos) {
    //   TipUtil.message('iOS端手机用户请用电脑登录进行下载')
    //   return
    // }

    if (!CommonUtil.hasBindUserInfo()) {
      return
    }

    // 免费的不用购买
    let sku = this.getItem(e)
    if (sku.price <= 0) {
      return
    }

    let loadModalComponent = this.data.loadModalComponent
    if (loadModalComponent.data.loading) {
      return
    }

    this.toggleLoading(true)
    api.buyGoods({
      goods_id: this.data.id,
      sku_id: sku.sku_id,
      // 小程序
      payment_method: 3
    }, (res) => {
      let data = res.data
      let packageParam = data.package;

      wx.requestPayment({
        ...packageParam,
        success: (res) => {
          TipUtil.message('支付成功')
          this.getById()
          wx.navigateTo({
            url: `/pages/zmall/orderDetail/index?id=${data.order.id}`
          })
        },
        fail: (res) => {
          if (!/cancel/.test(res.errMsg || '')) {
            TipUtil.error('支付失败');
          }
        }
      });
    }, () => {
      this.toggleLoading(false)
    })
  }
})