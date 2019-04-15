import * as api from '../../assets/js/api';
import TipUtil from '../../assets/js/TipUtil';
import ConfigUtil from '../../assets/js/ConfigUtil';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placement: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    wechat: 'yayunrap',
    showShareModal: false,
    rhymePage: {
      loading: false,
      list: [],
      mortgageButtons: [
        {
          value: 'single',
          text: '单押'
        },
        {
          value: 'double',
          text: '双押'
        },
        {
          value: 'three',
          text: '三押'
        }
      ],
      keyword: '',
      // 押韵规则
      mortgage: 'double'
    }
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
    toOfficialAccounts() {
      wx.navigateTo({
        url: '/pages/user/officialAccounts/index'
      });
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
    changeKeyword(e) {
      this.setData({
        'rhymePage.keyword': e.detail.value
      });
    },
    toggleMortgage(e) {
      let value = e.currentTarget.dataset.value;

      if (value != this.data.mortgage) {
        this.setData({
          'rhymePage.mortgage': value
        });
        this.getRhymeList();
      }
    },
    toggleRhymeLoading(loading) {
      this.setData({
        'rhymePage.loading': loading
      });
    },
    getRhymeList(e) {
      // 通过点击'搜索'触发该事件
      if (e && e.type == 'confirm') {
        this.changeKeyword(e);
      }

      let data = this.data;

      this.toggleRhymeLoading(true);
      api.getRhymeList({
        kwd: data.rhymePage.keyword,
        mortgage: data.rhymePage.mortgage
      }, (res) => {
        this.setData({
          'rhymePage.list': res.words_res
        });
      }, () => {
        this.toggleRhymeLoading(false);
      });
    }
  }
})
