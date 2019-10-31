import TimeUtil from '../../../assets/js/TimeUtil'
import TipUtil from '../../../assets/js/TipUtil'
import * as api from '../../../assets/js/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIos: false,
    id: null,
    beat: null,
    loading: false,
    loadModalComponent: null,
    playTimeArr: [],
    totalTimeArr: [],
    playIndex: 0,
    total: 0,
    playing: false,
    beatComponent: null,
    commentComment: null,
    commentCount: 0,
    showList: false,
    showCommentList: false,
    collecting: false,
    currentTime: 0,
    duration: 0,
    movingBar: false,
    trackContainerWidth: null,
    pageX: null,
    playPercent: 0,
    startPercent: null,
    startPageX: null,
    startPercent: null
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
      isIos: getApp().globalData.platform == 'ios'
    })

    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getById()
    } else {
      beatComponent.getPage(1)
    }

    const query = wx.createSelectorQuery().in(this);
    query.select('#progress').boundingClientRect();
    query.exec((res) => {
      this.setData({
        trackContainerWidth: res[0].width
      });
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
    this.data.beatComponent.pausePlay()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.beatComponent.onUnload()
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
  prevent() {},
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

      let beatComponent = this.data.beatComponent
      beatComponent.setData({
        beat
      })
      beatComponent.getPage(1)
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
  // ---------------------拖动指针--------------------------
  touchStart(e) {
    this.setData({
      startPageX: e.touches[0].pageX,
      startPercent: this.data.playPercent,
      movingBar: true
    });

    this.pausePlay()
  },
  movePointer(e) {
    let touches = e.touches
    let prePageX = this.data.startPageX
    let pageX = e.touches[0].pageX
    let duration = this.data.duration;

    let width = pageX - prePageX
    let percent = width / this.data.trackContainerWidth;
    let currentPercent = this.data.startPercent / 100 + percent;
    currentPercent = Math.min(1, currentPercent);
    currentPercent = Math.max(0, currentPercent);
    let time = currentPercent * duration

    if (time >= duration) {
      time = duration;
      this.data.beatComponent.beatAudioEnded();
    }

    this.data.beatComponent.caculateTime(time)
  },
  touchEnd(e) {
    let that = this.data.beatComponent
    let BAC = that.data.BAC;
    this.setData({
      movingBar: false
    })
    BAC.seek(this.data.currentTime);
    this.continuePlay()
  },
  // ---------------------拖动指针--------------------------
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
  },
  toBuy() {
    wx.navigateTo({
      url: `/pages/zmall/buy/index?id=${this.data.beat.id}`
    })
  }
})