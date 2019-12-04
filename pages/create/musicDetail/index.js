import TimeUtil from '../../../assets/js/TimeUtil'
import TipUtil from '../../../assets/js/TipUtil'
import CommonUtil from '../../../assets/js/CommonUtil'
import * as api from '../../../assets/js/api';
import PosterCanvasUtil from '../../../assets/js/components/PosterCanvasUtil';
import BAC from '../../../assets/js/components/backgroundAudio/BAC'
import MoveProgressUtil from '../../../assets/js/MoveProgressUtil'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    music: null,
    loading: false,
    loadModalComponent: null,
    playTimeArr: [],
    totalTimeArr: [],
    playIndex: 0,
    total: 0,
    playing: true,
    musicComponent: null,
    commentComponent: null,
    commentCount: 0,
    musicPosterComponent: null,
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
    startPercent: null,
    showShareModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent')
    let musicComponent = this.selectComponent('#musicComponent')
    let commentComponent = this.selectComponent('#commentComponent')
    let musicPosterComponent = this.selectComponent('#musicPosterComponent');

    // 详情页也有播放功能，可能会导致背景音乐与外部列表页播放不同步
    BAC.autoPlay = true
    musicComponent.init(this);
    commentComponent.setData({
      type: 'music'
    })
    commentComponent.init(this);
    // 保持不锁屏
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
    musicPosterComponent.setData({
      type: 'music'
    })

    this.setData({
      loadModalComponent,
      musicComponent,
      commentComponent,
      musicPosterComponent
    })

    if (options.id) {
      this.setData({
        id: options.id
      })
      this.getById()
    } else {
      musicComponent.getPage(1)
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
    let item = this.data.music
    return {
      title: item.music_title,
      imageUrl: item.musics_cover,
      path: '/pages/study/studyList/index?t=music&id=' + item.id
    }
  },
  toggleShareModal(showShareModal) {
    this.setData({
      showShareModal
    })
  },
  toShare() {
    this.toggleShareModal(true)
  },
  closeShareModal() {
    this.toggleShareModal(false)
  },
  prevent() { },
  toggleLoading(loading) {
    this.data.loadModalComponent.setData({
      loading
    })
  },
  getById() {
    this.toggleLoading(true)
    api.getMusicById({
      id: this.data.id,
      include: 'user'
    }, (res) => {
      let music = res.data
      this.setData({
        music
      })

      let musicComponent = this.data.musicComponent
      musicComponent.setData({
        music
      })
      musicComponent.getPage(1)
    }, () => {
      this.toggleLoading(false)
    })
  },
  setTitle(item) {
    wx.setNavigationBarTitle({
      title: item.music_title
    })
  },
  getCommentPage() {
    let commentComponent = this.data.commentComponent
    commentComponent.setData({
      targetId: this.data.music.id
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
    let musicComponent = this.data.musicComponent
    musicComponent.prevItem()
  },
  next() {
    let musicComponent = this.data.musicComponent
    musicComponent.nextItem()
  },
  continuePlay() {
    this.data.musicComponent.continuePlay()
  },
  pausePlay() {
    this.data.musicComponent.pausePlay()
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
    let musicComponent = this.data.musicComponent
    let list = musicComponent.data.page.list
    let music = list[index]
    let isCollected = music.collection
    let fn

    if (isCollected) {
      fn = api.deleteNewCollection
    } else {
      fn = api.addNewCollection
    }

    fn({
      id: music.id,
      type: 'music'
    }, (res) => {
      music.collection = !isCollected

      musicComponent.setData({
        [`page.list[${index}]`]: music
      })
      // 操作的可能是正在播放的music
      this.setData({
        music: list[this.data.playIndex]
      })
    }, () => {
      this.toggleCollecting(false)
    })
  },
  // 下载海报
  generatePoster(e) {
    this.data.musicPosterComponent.generatePoster(this.data.music, 'music');
  },
  setAutoPlay(autoPlay) {
    this.data.musicComponent.setData({
      autoPlay
    })
  }
})