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
    tabs: [
      {
        flag: 'music',
        name: '音乐作品'
      },
      {
        flag: 'beat',
        name: 'Beat商城'
      },
      {
        flag: 'article',
        name: '圈内文章'
      },
      {
        flag: 'video',
        name: '圈内视频'
      }
    ],
    activeIndex: 2,
    totalWidth: 1000,
    musicComponent: null,
    beatComponent: null,
    articleComponent: null,
    videoComponent: null
  },
  ready() {
    let musicComponent = this.selectComponent('#musicComponent')
    let beatComponent = this.selectComponent('#beatComponent')
    let articleComponent = this.selectComponent('#articleComponent')
    let videoComponent = this.selectComponent('#videoComponent')
    this.setData({
      musicComponent,
      beatComponent,
      articleComponent,
      videoComponent
    })

    this.setWidth()
    this.getPage(1)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onHide() {

    },
    setWidth() {
      let query = wx.createSelectorQuery().in(this)
      let that = this;
      query.selectAll('.tab-item').boundingClientRect(function (rectList) {
        let totalWidth = 0;
        for (let i = 0; i < rectList.length; i++) {
          totalWidth += Math.ceil(rectList[i].width);
        }

        that.setData({
          totalWidth
        });
      }).exec();
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
    toggleTab(e) {
      let index = this.getIndex(e);
      let item = this.data.tabs[index]
      if (index != this.data.activeIndex) {
        this.setData({
          activeIndex: index
        })
        this.getPage(1)
      }
    },
    getPage(current_page = 1) {
      let data = this.data,
        tabs = data.tabs,
        item = data.tabs[data.activeIndex],
        id = item.flag;

      if (item.flag == 'article') {
        let articleComponent = this.data.articleComponent
        if (!articleComponent.data.tabs.length) {
          articleComponent.getCategoryList()
        } else {
          articleComponent.getPage(current_page)
        }
      } else if (item.flag == 'music') {
        let musicComponent = this.data.musicComponent
        if (!musicComponent.data.tabs.length) {
          musicComponent.getCategoryList()
        } else {
          musicComponent.getPage(current_page)
        }
      } else if (item.flag == 'beat') {
        let beatComponent = this.data.beatComponent
        if (!beatComponent.data.tabs.length) {
          beatComponent.getCategoryList()
        } else {
          beatComponent.getPage(current_page)
        }
      } else if (item.flag == 'video') {
        let videoComponent = this.data.videoComponent
        if (!videoComponent.data.tabs.length) {
          videoComponent.getCategoryList()
        } else {
          videoComponent.getPage(current_page)
        }
      }
    }
  }
})
