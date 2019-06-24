import CommonUtil from '../../../assets/js/CommonUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import TipUtil from '../../../assets/js/TipUtil';
import PathUtil from '../../../assets/js/PathUtil';
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    type: null,
    swipperOption: {
      showIndicatorDots: true,
      indicatorColor: 'rgb(229, 229, 229)',
      indicatorActiveColor: 'rgb(20,21,26)'
    },
    detail: {},
    // 颜色、规格
    gifts: [],
    colorGift: null,
    loadModal: null,
    playing: false,
    // 邮箱
    showEmailModal: false,
    // 配送地址详情
    showAddressModal: false,
    activeFormatIndex: 0,
    modalLevel: 0,
    email: '',
    address: null,
    BAC: null,
    beatPlaying: false,
    beatParam: {},
    // 接收beat的邮箱key
    MALL_RECEIVE_BEAT_EMAIL_KEY: 'mall_beat_email'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModal = this.selectComponent('#loadModal');
    loadModal.init(this);

    this.setData({
      loadModal,
      id: options.id,
      email: wx.getStorageSync(this.data.MALL_RECEIVE_BEAT_EMAIL_KEY) || '',
      // 商品类型（beat、周边）
      type: options.type || 'beat'
    });

    this.getById();
    this.getDefaultAddress()
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
    if (this.data.BAC) {
      this.data.BAC.pause()
      this.data.BAC.destroy();
    }
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
    return {
      title: getApp().globalData.appName,
      path: `/pages/mall/beatDetail/index?id=${this.data.detail.id}`
    };
  },
  toggleLoading(loading) {
    this.data.loadModal.toggleLoading(loading);
  },
  getById() {
    let id = this.data.id;
    this.toggleLoading(true);

    api.getGoodsById({
      id
    }, (res) => {
      let data = res.data;
      let cover_images = data.cover_images.map(item => {
        return PathUtil.getFilePath(item)
      })
      data.cover_images = cover_images

      let gifts = []
      // beat
      if (data.beat_try_url) {
        if (data.gift && data.gift.goods_specs.length) {
          gifts = data.gift.goods_specs || []
        }
      } else {
        // 周边商城
        gifts = data.goods_specs || []
      }

      gifts.forEach((item, index) => {
        item.activeIndex = 0
        if (item.type == 'image') {
          this.setData({
            colorGift: item
          })
        }
      })
      this.setData({
        gifts
      });

      // beat，需要初始化BAC
      if (data.beat_try_url) {
        this.initBAC(data.beat_try_url)
      }

      this.setData({
        detail: data
      });
    }, () => {
      this.toggleLoading(false);
    }, () => {
      setTimeout(() => {
        wx.navigateBack({
          
        });
      }, 1000);
    });
  },
  getDefaultAddress() {
    api.getDefaultAddress(null, (res) => {
      if (res.data) {
        this.setData({
          address: res.data
        })
      }
    })
  },
  initBAC(url) {
    let BAC = wx.createInnerAudioContext();
    BAC.src = PathUtil.getFilePath(url);
    this.setData({
      BAC
    });
    this.bindBACEvent();
  },
  bindBACEvent() {
    let BAC = this.data.BAC;

    BAC.autoplay = false;
    BAC.onTimeUpdate(() => {
      this.audioTimeUpdate(BAC.duration, BAC.currentTime);
    });

    BAC.onError((res) => {
      this.audioError();
    });

    BAC.onEnded((res) => {
      this.beatAudioEnded();
    });
  },
  togglePlay(e) {
    if (this.data.beatPlaying) {
      this.pausePlay(e)
    } else {
      this.play(e)
    }
  },
  play(e) {
    let BAC = this.data.BAC;

    this.setData({
      beatPlaying: true
    });

    // 播放音频
    BAC.play();
  },
  pausePlay(e) {
    let BAC = this.data.BAC;

    this.setData({
      beatPlaying: false
    });

    BAC.pause();
  },
  audioError(e) {
    if (e.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
      TipUtil.message('播放失败');
    }
    this.beatAudioEnded(e);
  },
  audioTimeUpdate(totalTime, time) {
    this.setBeatTime(totalTime, time);
  },
  // 计算剩余时间
  setBeatTime(totalTime, currentTime) {
    let beatParam = this.data.beatParam

    beatParam.totalTime = totalTime;
    beatParam.currentTime = currentTime;

    this.setData({
      beatParam
    });
  },
  beatAudioEnded(e) {
    let BAC = this.data.BAC;

    this.setData({
      beatPlaying: false
    });

    BAC.seek(0);
  },
  previewImg(e) {
    let index = this.getIndex(e),
    urls = this.data.detail.cover_images
    wx.previewImage({
      urls,
      current: urls[index]
    });
  },
  previewGiftImg(e) {
    let index = this.getIndex(e),
    urls = this.data.colorGift.spec_value.map(item => {
      return item.image
    })
    wx.previewImage({
      urls,
      current: urls[index]
    });
  },
  // 默认增加modalLevel
  toggleModalLevel(increase = true) {
    let modalLevel = this.data.modalLevel;
    modalLevel = increase ? ++modalLevel : --modalLevel;
    this.setData({
      modalLevel
    });

    if (!increase) {
      this.setData({
        showEmailModal: false,
        showAddressModal: false
      });
    }
  },
  toggleEmailModal(showEmailModal) {
    this.setData({
      showEmailModal
    });
    this.toggleModalLevel(showEmailModal);
  },
  toggleAddressModal(showAddressModal) {
    this.setData({
      showAddressModal
    });
    this.toggleModalLevel(showAddressModal);
  },
  toBuy() {
    this.toggleModalLevel(true);
  },
  closeModal() {
    this.toggleModalLevel(false);
  },
  getIndex(e) {
    let index = e.target.dataset.index;
    if (isNaN(index)) {
      index = e.currentTarget.dataset.index;
    }

    return parseInt(index);
  },
  getChildIndex(e) {
    let childIndex = e.target.dataset.childIndex;
    if (isNaN(childIndex)) {
      childIndex = e.currentTarget.dataset.childIndex;
    }

    return parseInt(childIndex);
  },
  toggleColorPresent(e) {
    let index = this.getIndex(e),
    childIndex = this.getChildIndex(e);
    this.setData({
      [`gifts[${index}].activeIndex`]: childIndex,
      [`colorGift.activeIndex`]: childIndex
    });
  },
  togglePresent(e) {
    let index = this.getIndex(e),
    childIndex = this.getChildIndex(e);
    this.setData({
      [`gifts[${index}].activeIndex`]: childIndex
    });
  },
  toggleFormat(e) {
    let index = this.getIndex(e);
    this.setData({
      activeFormatIndex: index
    });
  },
  preventEvent() {

  },
  toSetAddress() {
    this.toggleModalLevel(true);
  },
  toggleShowAddress(showAddressModal) {
    this.setData({
      showAddressModal
    });
    this.toggleModalLevel(showAddressModal);
  },
  showAddress() {
    this.toggleShowAddress(true);
  },
  toggleShowEmail(showEmailModal) {
    this.setData({
      showEmailModal
    });
    this.toggleModalLevel(showEmailModal);
  },
  showEmail() {
    this.toggleShowEmail(true);
  },
  emailBlur(e) {
    this.setData({
      email: e.detail.value
    });
  },
  saveEmail() {
    if (this.validateEmail()) {
      this.toggleEmailModal(false);
    }
  },
  validateEmail() {
    let email = this.data.email;
    if (/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email)) {
      return true;
    } else {
      TipUtil.error('请输入有效的电子邮箱');
    }
  },
  toChooseAddress() {
    wx.navigateTo({
      url: '/pages/mall/address/list/index?forChoose=true'
    });
  },
  closeAddressModal() {
    if (this.data.address) {
      this.toggleAddressModal(false);
    } else {
      TipUtil.error('请设置收货地址');
    }
  },
  buyNow() {
    let detail = this.data.detail,
    address = this.data.address,
    email = this.data.email,
    type = this.data.type;

    // 有赠品的情况系，必须填写收货地址
    if (detail.gift && !this.data.address) {
      TipUtil.error('请设置收货地址');
      return
    }

    // 只有beat需要邮箱
    if (type == 'beat' && !this.validateEmail()) {
      TipUtil.error('请输入有效的电子邮箱');
      return
    }

    let specs = this.data.gifts.map(item => {
      let label = item.spec
      let type = item.type
      let value = item.spec_value[item.activeIndex]
      return {
        type,
        label,
        value
      }
    }),
    param = {
      id: this.data.id,
      addressId: address.id,
      details: {
        // 规格、颜色、尺寸
        specs
      }
    }

    // 如果是beat（只有beat有赠品），需要giftId
    if (type == 'beat') {
      param.email = email
      param.skuId = detail.goods_skus[this.data.activeFormatIndex].sku_id;
      if (detail.gift) {
        param.details.giftId = detail.gift.id
        // 赠品名称
        param.details.name = detail.gift.goods_name
      }
    }

    this.toggleLoading(true);
    api.buyGoodsById(param, (res) => {
      let data = res.data,
      packageParam = data.package;

      wx.requestPayment({
        ...packageParam,
        success: (res) => {
          TipUtil.success('购买成功')
          wx.setStorageSync(this.data.MALL_RECEIVE_BEAT_EMAIL_KEY, email);
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
      this.toggleLoading(false);
    });
  }
})