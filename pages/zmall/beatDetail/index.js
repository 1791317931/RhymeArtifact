import TimeUtil from '../../../assets/js/TimeUtil'
import TipUtil from '../../../assets/js/TipUtil'
import CommonUtil from '../../../assets/js/CommonUtil'
import * as api from '../../../assets/js/api';
import BAC from '../../../assets/js/components/backgroundAudio/BAC'
import MoveProgressUtil from '../../../assets/js/MoveProgressUtil'

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
    playing: true,
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
    playPercent: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent')
    let beatComponent = this.selectComponent('#beatComponent')
    let commentComponent = this.selectComponent('#commentComponent')

    // 详情页也有播放功能，可能会导致背景音乐与外部列表页播放不同步
    BAC.autoPlay = true
    beatComponent.init(this);
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
      let type = options.type
      if (type) {
        beatComponent.setData({
          type
        })
      }
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
    this.data.beatComponent.setStatus()
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
    let data = this.data.beat
    return {
      title: beat.goods_name,
      imageUrl: beat.cover_images[0],
      path: `/pages/zmall/index?id=${data.id}`
    }
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
      targetId: this.data.beat.id
    })
    commentComponent.getPage(1)
  },
  showListModal() {
    if (!CommonUtil.hasBindUserInfo()) {
      return
    }

    this.setData({
      showList: true
    })
  },
  showCommentModal() {
    if (!CommonUtil.hasBindUserInfo()) {
      return
    }

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
    MoveProgressUtil.touchStart(e)
  },
  movePointer(e) {
    MoveProgressUtil.movePointer(e)
  },
  touchEnd(e) {
    MoveProgressUtil.touchEnd(e)
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
    if (!CommonUtil.hasBindUserInfo()) {
      return
    }
    
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