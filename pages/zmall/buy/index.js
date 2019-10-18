Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      id: options.id
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
      this.setData({
        beat: {
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
      })

      this.toggleLoading(false)
    }, 1000)
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
    return this.data.beat.suks.list[index];
  },
  clickItem(e) {
    let index = this.getIndex(e)
    let beat = this.data.beat
    beat.skus[index].open = !beat.skus[index].open
    this.setData({
      beat
    })
  },
  buy(e) {

  }
})