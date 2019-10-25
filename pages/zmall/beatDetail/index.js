import TimeUtil from '../../../assets/js/TimeUtil'
import TipUtil from '../../../assets/js/TipUtil'
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    beat: null,
    loading: false,
    loadModalComponent: null,
    playTimeArr: [],
    totalTimeArr: [],
    playPercent: 0,
    playIndex: 0,
    total: 0,
    playing: false,
    beatComponent: null,
    commentComment: null,
    showList: false,
    showCommentList: false,
    collecting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent')
    let beatComponent = this.selectComponent('#beatComponent')
    let commentComponent = this.selectComponent('#commentComponent')

    let BAC = wx.createInnerAudioContext()
    beatComponent.init(this, {
      audioContext: BAC
    });
    commentComponent.init(this);
    // 保持不锁屏
    wx.setKeepScreenOn({
      keepScreenOn: true
    });

    this.setData({
      loadModalComponent,
      beatComponent,
      commentComponent,
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
    this.data.beatComponent.destroy()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.beatComponent.pausePlay()
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
      this.setData({
        beat
      })

      this.setTitle(beat)
      let beatComponent = this.data.beatComponent
      beatComponent.setData({
        beat
      })
      beatComponent.getPage(1)
      // 获取评论
      this.getCommentPage()
    }, () => {
      this.toggleLoading(false)
    })
  },
  setTitle(item) {
    wx.setNavigationBarTitle({
      title: item.goods_name
    })
  },
  getCommentPage() {
    let commentComponent = this.data.commentComponent
    commentComponent.setData({
      beatId: this.data.beat.id
    })
    commentComponent.getPage(1)
  },
  showListModal() {
    this.setData({
      showList: true
    })
  },
  showCommentModal() {
    this.setData({
      showCommentList: true
    })
  },
  closeListModal() {
    this.setData({
      showList: false
    })
  },
  closeCommentModal() {
    this.setData({
      showCommentList: false
    })
  },
  prev() {
    let beatComponent = this.data.beatComponent
    beatComponent.prevItem()
  },
  next() {
    let beatComponent = this.data.beatComponent
    beatComponent.nextItem()
  },
  continuePlay() {
    this.data.beatComponent.continuePlay()
  },
  pausePlay() {
    this.data.beatComponent.pausePlay()
  },
  toggleCollecting(collecting) {
    this.setData({
      collecting
    })
  },
  toggleCollection(e) {
    if (this.data.collecting) {
      return
    }

    this.toggleCollecting(true)
    let index = typeof e == 'number' ? e : this.data.playIndex
    let beatComponent = this.data.beatComponent
    let list = beatComponent.data.page.list
    let beat = list[index]
    let isCollected = beat.collection
    let fn

    if (isCollected) {
      fn = api.deleteNewCollection
    } else {
      fn = api.addNewCollection
    }

    fn({
      id: beat.id,
      type: 'goods'
    }, (res) => {
      beat.collection = !isCollected

      beatComponent.setData({
        [`page.list[${index}]`]: beat
      })
      // 操作的可能是正在播放的beat
      this.setData({
        beat: list[this.data.playIndex]
      })
    }, () => {
      this.toggleCollecting(false)
    })
  }
})