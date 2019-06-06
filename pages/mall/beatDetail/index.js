import CommonUtil from '../../../assets/js/CommonUtil';
import TipUtil from '../../../assets/js/TipUtil';
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
    loadModal: null,
    playing: false,
    // 邮箱
    showEmailModal: false,
    // 配送地址详情
    showAddressModal: false,
    activeProductIndex: 0,
    activeFormatIndex: 0,
    modalLevel: 0,
    email: '123@qq.com',
    address: null,
    formats: [
      {
        id: 1,
        name: 'beat租用.MP3'
      },
      {
        id: 2,
        name: 'beat租用.WAV'
      },
      {
        // 买断
        id: 3,
        name: 'beat独家包分轨'
      }
    ]
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
      // 商品类型（beat、周边）
      type: options.type || 'beat'
    });

    this.getById();
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
      let data = res.goods[0];
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

    return;
    setTimeout(() => {
      this.setData({
        detail: {
          id: 1,
          name: 'old school风格beat《一条鱼》加嘻哈帽子',
          beat_cover: '/assets/imgs/logo.png',
          beat_url: '/beat/cuco.mp3',
          products: [
            {
              id: 1,
              cover: '/assets/imgs/demo/hat_1.png'
            },
            {
              id: 2,
              cover: '/assets/imgs/demo/hat_2.png'
            },
            {
              id: 3,
              cover: '/assets/imgs/demo/hat_3.png'
            }
          ],
          price: 98,
          description: 'old school风格beat可以用于写老学校带有一定的情歌，此beat融合了一定的中国风旋律色彩、融合竹笛、古筝等中国风元素。在音乐制作上可以大大发挥一定空灵的通透感。 购买beat可选择一个品牌嘻哈帽'
        }
      });
      this.toggleLoading(false);
    }, 1000);
  },
  previewImg(e) {
    let index = this.getIndex(e);
    let urls = this.data.detail.products.map(item => {
      return item.cover;
    });
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
    this.toggleModalLevel(showEmailModal);
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
  toggleProduct(e) {
    let index = this.getIndex(e);
    this.setData({
      activeProductIndex: index
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
  }
})