// components/searchLyric/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placement: String,
    rhymePage: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    wechat: '17301257015',
    showShareModal: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleOpenModal() {
      this.setData({
        showShareModal: !this.data.showShareModal
      })
    },
    setClipboardData(e) {
      let value = e.currentTarget.dataset && e.currentTarget.dataset.value
      wx.setClipboardData({
        data: value || this.data.wechat,
        success:()=>{
          if(!value) {
            this.handleOpenModal()
          }
        }
      })
    },
    toggleMortgage(e) {
      this.triggerEvent('toggleMortgage', e)
    },
    changeKeyword(e) {
      this.triggerEvent('changeKeyword', e)
    },
    getRhymeList(e) {
      this.triggerEvent('getRhymeList', e)
    }
  }
})
