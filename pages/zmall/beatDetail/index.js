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
    commentComponent: null,
    commentCount: 0,
    showList: false,
    showCommentList: false,
    collecting: false,
    currentTime: 0,
    duration: 0,
    movingBar: false,
    trackContainerWidth: null,
    playPercent: 0,
    isShowModalShare: false, // 是否显示分享modal
    isPosterCreate: false,   // 是否创建海报
    posterRatio: 1,          // 海报尺寸比
    posterCanvas: null       // 海报canvas实例
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
      title: data.goods_name,
      imageUrl: data.cover_images[0],
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
      this.getCommentPage()

      BAC.play({
        type: 'beat',
        id: beat.id,
        title: beat.goods_name,
        epname: beat.goods_name,
        singer: beat.author,
        coverImgUrl: beat.cover_images[0],
        src: beat.beat_try_url
      })
      beatComponent.setData({
        showPlaying: true
      })
      this.setData({
        beat
      })
      this.setTitle(beat)
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
  
  // 显示分享modal
  showModalShareHandle() {
    if (!CommonUtil.hasBindUserInfo()) {
      return
    }
    this.setData({
      isShowModalShare: true
    })
  },
  // 隐藏分享modal
  hideModalShareHandle() {
    this.setData({
      isShowModalShare: false
    })
  },
  // 显示海报modal
  showModalPosterHandle() {
    this.setData({
      isShowModalShare: false,
      isPosterCreate: true
    })

    this.createPosterHandle()
  },
  // 隐藏海报modal
  hideModalPosterHandle() {
    this.setData({
      isPosterCreate: false
    })
  },
  // 创建海报
  createPosterHandle() {
    const query = wx.createSelectorQuery()
    
    query.select('#poster')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        this.setData({
          posterCanvas: res[0].node,
          posterRatio: res[0].width / 540 // wxss canvas宽高影响
        }, () => {
          const ctx = this.data.posterCanvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          this.data.posterCanvas.width = res[0].width * dpr
          this.data.posterCanvas.height = res[0].height * dpr
          ctx.scale(dpr, dpr)
          
          // 背景色
          ctx.fillStyle = '#252B37'
          ctx.fillRect(0, 0, res[0].width * dpr, res[0].height * dpr)

          ctx.fillStyle = '#fff'
          ctx.fillRect(this.posterComputeSize(30), this.posterComputeSize(30), this.posterComputeSize(480), this.posterComputeSize(480))

          // 封面
          const poster = this.data.posterCanvas.createImage()
          poster.src = this.data.beat.cover_images[0]
          poster.onload = () => {
            ctx.drawImage(poster, this.posterComputeSize(30), this.posterComputeSize(30), this.posterComputeSize(480), this.posterComputeSize(480))
          }

          // 标题
          ctx.fillStyle = '#fff'

          ctx.font = `${this.posterComputeSize(28)}px sans-serif`
          const title = this.data.beat.goods_name.length > 16 ? `${this.data.beat.goods_name.substring(0, 16)}...` : this.data.beat.goods_name
          ctx.fillText(title, this.posterComputeSize(30), this.posterComputeSize(560))
          ctx.save()

          // 作者
          ctx.font = `${this.posterComputeSize(24)}px sans-serif`
          ctx.fillText(this.data.beat.author, this.posterComputeSize(30), this.posterComputeSize(600))

          // 二维码
          const code = this.data.posterCanvas.createImage()
          code.src = '/assets/imgs/mall/code.png'
          code.onload = () => {
            ctx.drawImage(code, this.posterComputeSize(386), this.posterComputeSize(522), this.posterComputeSize(124), this.posterComputeSize(124))
          }

          // logo
          const logo = this.data.posterCanvas.createImage()
          logo.src = '/assets/imgs/mall/logo-text.png'
          logo.onload = () => {
            ctx.drawImage(logo, this.posterComputeSize(216), this.posterComputeSize(708), this.posterComputeSize(110), this.posterComputeSize(22))
          }
        })
      })
  },
  // 保存海报
  savePosterHandle() {
    const dpr = wx.getSystemInfoSync().pixelRatio

    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: () => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 540,
          height: 746,
          destWidth: 540 * dpr,
          destHeight: 746 * dpr,
          canvas: this.data.posterCanvas,
          fileType: 'jpg',
          success: ({tempFilePath}) => {
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success: () => {
                wx.showToast({
                  title: `已保存`
                })
                this.hideModalPosterHandle()
              }
            })
          }
        })
      },
      fail: () => {
        wx.showToast({
          title: '取消了授权'
        })
      }
    })
  },
  posterComputeSize(size) {
    return this.data.posterRatio * size
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
  },
  setAutoPlay(autoPlay) {
    this.data.beatComponent.setData({
      autoPlay
    })
  }
})