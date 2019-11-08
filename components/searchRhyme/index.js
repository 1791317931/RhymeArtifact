import * as api from '../../assets/js/api';
import TipUtil from '../../assets/js/TipUtil';
import ConfigUtil from '../../assets/js/ConfigUtil';
const app = getApp();
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
    wechat: '',
    descArr: [],
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
  attached() {
    this.getWechatInfo();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getWechatInfo() {
      // api.getWechatInfo({
      //   key: 'wechat'
      // }, (res) => {
      //   this.setData({
      //     wechat: res.data.config_value
      //   });
      // });
      this.setData({
        wechat: 'yayunrap'
      });
    },
    handleOpenModal() {
      app.aldstat.sendEvent('添加微信群', '添加微信群')
      this.setData({
        showShareModal: !this.data.showShareModal
      })
    },
    toOfficialAccounts() {
      app.aldstat.sendEvent('关注公众号', '关注公众号')
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

      if (value != this.data.rhymePage.mortgage) {
        this.setData({
          'rhymePage.mortgage': value
        });

        let data = this.data,
        kwd = data.rhymePage.keyword.trim();
        if (kwd.length) {
          this.getRhymeList();
        }
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

      let data = this.data,
      kwd = data.rhymePage.keyword.trim();
      if (!kwd.length) {
        TipUtil.message('请输入词汇');
        return;
      }

      this.toggleRhymeLoading(true);
      api.getRhymeList({
        kwd,
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
