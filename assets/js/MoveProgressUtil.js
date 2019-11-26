import BAC from './components/backgroundAudio/BAC'

// 背景音乐与详情页同步，所以音乐和beat详情页不需要audioComponent
const MoveProgressUtil = {
  scope: null,
  playPercent: null,
  startPercent: null,
  startPageX: null,
  getScope() {
    const pages = getCurrentPages()
    const page = pages[pages.length - 1]
    const audioComponent = page.data.audioComponent

    if (audioComponent) {
      return audioComponent
    } else {
      return page
    }
  },
  touchStart(e) {
    let scope = this.getScope()
    scope.setData({
      movingBar: true
    })
    
    this.startPageX = e.touches[0].pageX
    this.startPercent = scope.data.playPercent,
    this.movingBar = true

    BAC.pausePlay()
  },
  movePointer(e) {
    let scope = this.getScope()
    let touches = e.touches
    let prePageX = this.startPageX
    let pageX = e.touches[0].pageX
    let duration = scope.data.duration

    let width = pageX - prePageX
    let percent = width / scope.data.trackContainerWidth;
    let currentPercent = this.startPercent / 100 + percent;
    currentPercent = Math.min(1, currentPercent);
    currentPercent = Math.max(0, currentPercent);
    let time = currentPercent * duration

    if (time >= duration) {
      time = duration;
      BAC.ended()
    }

    BAC.caculateTime(time)
  },
  touchEnd(e) {
    let scope = this.getScope()
    scope.setData({
      movingBar: false
    })
    BAC.continuePlay()
  }
}

export default MoveProgressUtil