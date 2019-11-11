import TimeUtil from '../../../assets/js/TimeUtil'
import TipUtil from '../../../assets/js/TipUtil'
import CommonUtil from '../../../assets/js/CommonUtil'
import * as api from '../../../assets/js/api';
import PosterCanvasUtil from '../../../assets/js/components/PosterCanvasUtil';

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
    playing: false,
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

    let BAC = wx.createInnerAudioContext()
    musicComponent.init(this, {
      audioContext: BAC
    });
    commentComponent.setData({
      type: 'music'
    })
    commentComponent.init(this);
    // 保持不锁屏
    wx.setKeepScreenOn({
      keepScreenOn: true
    });

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
    this.data.musicComponent.pausePlay()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.musicComponent.onUnload()
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
      path: '/pages/create/musicDetail/index?type=music&id=' + item.id
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
      this.data.musicComponent.musicAudioEnded();
    }

    this.data.musicComponent.caculateTime(time)
  },
  touchEnd(e) {
    let that = this.data.musicComponent
    let BAC = that.data.BAC;
    this.setData({
      movingBar: false
    })
    BAC.seek(this.data.currentTime);
    this.continuePlay()
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
})