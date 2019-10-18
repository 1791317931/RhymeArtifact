import TimeUtil from '../../../assets/js/TimeUtil'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    beat: {},
    loading: false,
    beatList: [],
    loadModalComponent: null,
    playTime: null,
    playTimeArr: [],
    totalTime: null,
    totalTimeArr: [],
    playing: false,
    beatComponent: null,
    commentComment: null,
    showList: false,
    showCommentList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loadModalComponent = this.selectComponent('#loadModalComponent')
    let beatComponent = this.selectComponent('#beatComponent')
    let commentComponent = this.selectComponent('#commentComponent')
    beatComponent.init(this, false);
    commentComponent.init(this);

    this.setData({
      loadModalComponent,
      beatComponent,
      commentComponent,
      // id: options.id
    })

    this.getById()
    wx.setNavigationBarTitle({
      title: 'beat标题'
    })
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
          duration: 240
        }
      })
      this.setPlayTime()
      this.setTotalTime()

      // 获取评论
      let commentComponent = this.data.commentComponent
      commentComponent.setData({
        beatId: 1
      })
      commentComponent.getPage(1)

      this.toggleLoading(false)
    }, 1000)
  },
  setPlayTime() {
    this.setData({
      playTime: 0,
      playTimeArr: TimeUtil.numberToArr(0)
    })
  },
  setTotalTime() {
    let beat = this.data.beat
    this.setData({
      totalTime: beat.duration,
      totalTimeArr: TimeUtil.numberToArr(beat.duration)
    })
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
  showCommentModal() {
    this.setData({
      showCommentList: false
    })
  }
})