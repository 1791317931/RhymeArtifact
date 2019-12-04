import TimeUtil from '../../TimeUtil'
import TipUtil from '../../TipUtil'

const BAC = {
  playIndex: -1,
  audio: null,
  playing: false,
  playTimeArr: 0,
  currentTime: 0,
  totalTimeArr: 0,
  playPercent: 0,
  // 是否是自动播放
  autoPlay: false,
  list: [],
  // 播放序号
  listIndex: -1,
  init() {
    let audio = wx.getBackgroundAudioManager()
    this.audio = audio
    audio.autoplay = true

    audio.onPause(() => {
      this.pausePlay()
    })

    audio.onPlay(() => {
      this.playing = true
      this.setState({
        playing: true
      })
    })

    audio.onEnded((e) => {
      this.playing = false
      this.ended(e)
    })

    audio.onTimeUpdate(() => {
      this.caculateTime(audio.currentTime)
    })

    audio.onError((res) => {
      if (e.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
        TipUtil.message('播放失败');
      }

      this.ended(e);
    })
  },
  getAudio() {
    return this.audio
  },
  // autoPlay:是否是自动循环播放
  play(param, autoPlay = false) {
    let audio = this.getAudio()

    if (param) {
      // 音频标题，用于原生音频播放器音频标题（必填）。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值。
      audio.title = param.title
      // 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
      audio.epname = param.epname
      // 歌手名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
      audio.singer = param.singer
      // 封面图 URL，用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图。
      audio.coverImgUrl = param.img
      audio.src = param.src
      // 播放音频
      audio.seek(0);
      this.setState({
        autoPlay
      })
      let page = this.getPage()
      // 有就执行，有些页面比如beat详情和音乐详情，不能设置audioComponent，只能通过该方法设置组件的autoPlay
      page.setAutoPlay && page.setAutoPlay(autoPlay)
      this.autoPlay = autoPlay

      // 如果用用户自己点击播放，需要添加到播放序列
      if (!autoPlay) {
        let list = this.list
        list.push(param)
        this.listIndex = list.length - 1
      }
    }

    audio.play();
  },
  pausePlay() {
    this.playing = false
    this.setState({
      playing: false
    })
    this.getAudio().pause()
  },
  continuePlay() {
    let audio = this.getAudio()
    audio.seek(this.currentTime)
    // 播放音频
    audio.play()
  },
  caculateTime(currentTime) {
    let audio = this.getAudio()
    let totalTime = audio.duration
    let totalTimeArr = TimeUtil.numberToArr(Math.round(totalTime))
    let playPercent = (currentTime / totalTime > 1 ? 1 : currentTime / totalTime) * 100
    this.setState({
      totalTimeArr,
      duration: totalTime,
      currentTime,
      playTimeArr: TimeUtil.numberToArr(Math.round(currentTime)),
      playPercent
    })

    this.currentTime = currentTime
  },
  ended(e) {
    let audio = this.getAudio()
    audio.seek(0)

    this.setState({
      playing: false
    })

    // 播放结束后，自动循环播放下一首
    this.next()
  },
  error(e) {
    if (e.detail.errMsg == 'MEDIA_ERR_SRC_NOT_SUPPORTED') {
      TipUtil.message('播放失败')
    }

    this.ended(e);
  },
  next() {
    let list = this.list
    let listIndex = (this.listIndex + 1) % list.length

    this.listIndex = listIndex
    // 循环播放下一首
    let item = list[listIndex]
    this.play(item, true)

    // 自动播放
    this.setState({
      autoPlay: true
    })
  },
  setState(state) {
    let page = this.getPage()
    let audioComponent = page.data.audioComponent

    if (audioComponent) {
      audioComponent.setData({
        ...state
      })
    }

    page.setData({
      ...state
    })
  },
  getPage() {
    const pages = getCurrentPages()
    return pages[pages.length - 1]
  }
}

export default BAC