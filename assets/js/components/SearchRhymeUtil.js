import * as api from '../api';
import TipUtil from '../TipUtil';
import ConfigUtil from '../ConfigUtil';

let SearchRhymeUtil = {
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
  },
  changeKeyword(e, _this) {
    _this.setData({
      'rhymePage.keyword': e.detail.value
    });
  },
  toggleMortgage(e, _this) {
    let value = e.currentTarget.dataset.value;

    if (value != _this.data.mortgage) {
      _this.setData({
        'rhymePage.mortgage': value
      });
      _this.getRhymeList();
    }
  },
  toggleRhymeLoading(loading, _this) {
    _this.setData({
      'rhymePage.loading': loading
    });
  },
  getRhymeList(e, _this) {
    // 通过点击'搜索'触发该事件
    if (e && e.type == 'confirm') {
      SearchRhymeUtil.changeKeyword(e, _this);
    }

    let data = _this.data;

    SearchRhymeUtil.toggleRhymeLoading(true, _this);
    api.getRhymeList({
      kwd: data.rhymePage.keyword,
      mortgage: data.rhymePage.mortgage
    }, (res) => {
      _this.setData({
        'rhymePage.list': res.words_res
      });
    }, () => {
      SearchRhymeUtil.toggleRhymeLoading(false, _this);
    });
  }
};

export default SearchRhymeUtil;