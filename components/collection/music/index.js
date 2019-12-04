import TipUtil from '../../../assets/js/TipUtil';
import CommonUtil from '../../../assets/js/CommonUtil';
import ConfigUtil from '../../../assets/js/ConfigUtil';
import PathUtil from '../../../assets/js/PathUtil';
import TimeUtil from '../../../assets/js/TimeUtil';
import * as api from '../../../assets/js/api';
import BAC from '../../../assets/js/components/backgroundAudio/BAC'
import MoveProgressUtil from '../../../assets/js/MoveProgressUtil'

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isIos: false,
    scope: null,
    tabs: [],
    BAC: null,
    activeId: -1,
    tabWidth: 10000,
    page: {
      loading: false,
      playingIndex: -1,
      playing: false,
      current_page: 1,
      // 查所有
      per_page: 5000,
      total_pages: 0,
      list: []
    },
    playIndex: -1,
    playing: false,
    playTimeArr: 0,
    totalTimeArr: 0,
    playPercent: 0,
    showIndex: -1,
    // 外部可能单独传递了一个music，goods详情页
    music: null,
    // 是否显示播放状态
    showPlaying: true,
    autoPlay: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setScope(scope) {
      this.setData({
        scope
      });
    },
    // audioContext
    init(scope, option = {}) {
      // 保持不锁屏
      wx.setKeepScreenOn({
        keepScreenOn: true
      });

      let BAC = option.audioContext || wx.createInnerAudioContext()
      this.setData({
        BAC,
        isIos: getApp().globalData.platform == 'ios'
      })
      this.setScope(scope)
    },
    setStatus() {
      this.setData({
        autoPlay: BAC.autoPlay
      })
    },
    onReachBottom() {
      let page = this.data.page;
      if (page.current_page < page.total_pages) {
        this.getPage(page.current_page + 1);
      }
    },
    toggleItemStatus(e) {
      let index = e.currentTarget.dataset.index
      let playing = this.data.playing
      this.setData({
        autoPlay: false
      })

      // 必须是允许显示播放状态的情况下，才能继续播放或者暂停
      if (this.data.showPlaying && this.data.playIndex == index) {
        if (playing) {
          this.pausePlay(e);
        } else {
          this.continuePlay(e);
        }
      } else {
        this.startPlay(index);
      }
    },
    toggleStatus(playing) {
      this.setData({
        playing
      });
      this.data.scope.setData({
        playing
      })
    },
    startPlay(index) {
      this.play(index)
      // 获取评论
      this.data.scope.getCommentPage()
    },
    play(index) {
      let music = this.data.page.list[index]

      BAC.play({
        type: 'music',
        id: music.id,
        title: music.music_title,
        epname: music.music_title,
        singer: music.composer,
        coverImgUrl: music.musics_cover,
        src: music.origin_url
      })

      this.setData({
        playIndex: index,
        playing: true,
        showPlaying: true
      });
    },
    continuePlay() {
      BAC.continuePlay();
    },
    pausePlay() {
      BAC.pausePlay();
    },
    clickMore(e) {
      let index = this.getIndex(e)
      this.setData({
        showIndex: index
      })
    },
    hideMoreModal() {
      this.setData({
        showIndex: -1
      })
    },
    toggleCollectionItem() {
      this.data.scope.toggleCollection(this.data.showIndex)
    },
    prevItem(index) {
      index = index == undefined ? this.data.playIndex : this.data.showIndex
      if (index == 0) {
        index = this.data.page.list.length - 1
      } else {
        index--
      }

      this.play(index)
    },
    nextItem(index) {
      index = index == undefined ? this.data.playIndex : this.data.showIndex
      if (index == this.data.page.list.length - 1) {
        index = 0
      } else {
        index++
      }

      this.play(index)
      this.hideMoreModal()
    },
    shareItem() {
      let item = this.data.page.list[this.data.showIndex]
      return {
        title: item.goods_name,
        imageUrl: item.cover_images[0],
        path: `/pages/study/studyList/index?t=music&id=${item.id}`
      }
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
      return this.data.page.list[index];
    },
    togglePageLoading(loading) {
      this.setData({
        'page.loading': loading
      });
    },
    // 一次性查出所有数据
    getPage(pageNum = 1) {
      if (this.data.loading) {
        return
      }

      this.togglePageLoading(true)
      let page = this.data.page
      if (pageNum == 1) {
        this.setData({
          'page.list': []
        })
      }

      let param = {
        per_page: page.per_page,
        page: page.current_page
      }

      api.getMusicCollection(param, (res) => {
        let list = res.data
        let pagination = res.meta.pagination
        page.total_pages = pagination.total_pages
        page.current_page = pageNum

        // 默认没有收藏
        let flagIndex = -1
        let originList = page.list
        // 可能没有music
        let music = this.data.music
        list.forEach((item, index) => {
          item.price = new Number(parseFloat(item.original_price)).toFixed(2)
          item.collection = true
          originList.push(item)

          if (music && music.id == item.id) {
            flagIndex = index
          }
        })

        let playIndex = 0
        // 存在
        if (music) {
          if (flagIndex != -1) {
            playIndex = flagIndex
          } else {
            // 没有在收藏列表，需要添加到首位
            originList.unshift(music)
          }
        }

        this.data.scope.setData({
          total: originList.length
        })
        page.list = originList

        this.setData({
          page
        })

        if(!BAC.playing) {
          this.startPlay(0)
        }
      }, () => {
        this.togglePageLoading(false)
      })
    }
  }
})