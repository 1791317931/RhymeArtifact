import TimeUtil from '../../../assets/js/TimeUtil'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    order: {},
    beat: {},
    loading: false,
    loadModalComponent: null,
    orderStatusMap: {
      0: '待支付',
      1: '已支付',
      2: '已取消',
      3: '支付超时'
    },
    openFormat: false,
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
      // id: options.id
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
    setTimeout(() => {
      let beat = {
        id: 1,
        title: '机器铃 砍菜刀',
        cover: '/assets/imgs/end-record.png',
        author: '张三',
        duration: 240,
        skus: [
          {
            id: 1,
            price: 100,
            level: 1
          },
          {
            id: 2,
            price: 200,
            level: 2
          },
          {
            id: 3,
            price: 300,
            level: 3
          },
          {
            id: 4,
            price: 400,
            level: 4
          }
        ]
      }
      let order = {
        id: 1,
        code: 'lfdjfklsjfklf',
        status: 2,
        level: 1,
        created_time: TimeUtil.getFormatTime(new Date(), 'yyyy-MM-dd HH:mm'),
        price: 3000
      }

      this.setData({
        beat,
        order
      })

      this.toggleLoading(false)
    }, 1000)
  },
  toggleTip() {
    this.setData({
      openFormat: !this.data.openFormat
    })
  },
  copy() {
    wx.setClipboardData({
      data: '复制的链接'
    })
  },
  buy() {
    
  }
})