import CommonUtil from '../../assets/js/CommonUtil';
import PathUtil from '../../assets/js/PathUtil';
import * as api from '../../assets/js/api'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAudient: true,
    menus: [
      {
        flag: 'residence',
        path: '/pages/user/residence/index/index',
        text: '成为音乐人'
      },
      {
        flag: 'collection',
        path: '/pages/user/collection/index',
        text: '我的喜欢'
      },
      {
        path: '/pages/create/createLyricsList/index',
        text: '我的歌词创作'
      },
      {
        flag: 'music',
        path: '/pages/user/music/index',
        text: '我的音乐创作'
      },
      {
        flag: 'linkUs',
        fn: 'showLinkUsModal',
        path: '',
        text: '联系客服',
      },
      {
        path: '',
        text: '商务合作',
        openType: 'contact'
      }
    ],
    loadModalComponent: null,
    linkUsComponent: null,
    userInfo: null,
    userBgImg: PathUtil.getOssImg('user-bg.png')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isAudient: CommonUtil.isAudient()
    })

    // if (this.data.isAudient) {
    //   let menus = this.data.menus
    //   menus.forEach(item => {
    //     if (['collection', 'music', 'linkUs'].indexOf(item.flag) != -1) {
    //       item.hide = true
    //     }
    //   })

    //   this.setData({
    //     menus
    //   })
    // }

    let loadModalComponent = this.selectComponent('#loadModalComponent')
    let linkUsComponent = this.selectComponent('#linkUsComponent')
    this.setData({
      loadModalComponent,
      linkUsComponent
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
    this.getUserInfo()
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
  onShareAppMessage: function (e) {
    return CommonUtil.share(e);
  },
  toggleLoading(loading) {
    this.data.loadModalComponent.setData({
      loading
    })
  },
  getUserInfo() {
    this.toggleLoading(true)
    api.getUserInfoByToken((res) => {
      if (res) {
        let data = res.data
        this.setData({
          userInfo: data
        })

        // 入驻成功或者入驻审核中
        if (data.is_certify != 0) {
          let menus = this.data.menus
          let menu
          for (let i = 0; i < menus.length; i++) {
            menu = menus[i]
            if (menu.flag == 'residence') {
              this.setData({
                [`menus[${i}].path`]: '/pages/user/residence/success/index'
              })
              break
            }
          }
        }
      }
    }, () => {
      this.toggleLoading(false)
    })
  },
  toOrderList() {
    if (!CommonUtil.hasBindUserInfo()) {
      return
    }

    wx.navigateTo({
      url: '/pages/user/order/index/index'
    })
  },
  toCollectionList() {
    if (!CommonUtil.hasBindUserInfo()) {
      return
    }

    wx.navigateTo({
      url: '/pages/zmall/beatDetail/index?type=collection'
    })
  },
  clickMenu(e) {
    if (!CommonUtil.hasBindUserInfo()) {
      return
    }

    let index = e.target.dataset.index
    let item = this.data.menus[index]
    let openType = item.openType
    let url = item.path
    let html = item.html

    if (item.fn) {
      this[item.fn]()
      return
    }

    if (openType == 'concat') {
      // 不用加代码
    } else if (html) {
      wx.navigateTo({
        url: `/pages/webview/index?path=${html}`,
      })
    } else if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  showLinkUsModal() {
    this.data.linkUsComponent.toggleModal(true)
  },
  toDetail() {
    if (!CommonUtil.hasBindUserInfo()) {
      return
    }

    wx.navigateTo({
      url: '/pages/user/info/index'
    })
  }
})