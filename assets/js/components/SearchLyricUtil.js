import * as api from '../api';
import TipUtil from '../TipUtil';
import ConfigUtil from '../ConfigUtil';

let SearchLyricUtil = {
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
    mortgage: 'single'
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
  getRhymeList(_this) {
    let data = _this.data;

    SearchLyricUtil.toggleRhymeLoading(true, _this);
    api.getRhymeList({
      kwd: data.rhymePage.keyword,
      mortgage: data.rhymePage.mortgage
    }, (res) => {
      if (ConfigUtil.isSuccess(res.code)) {
        _this.setData({
          'rhymePage.list': res.data
        });
      } else {
        TipUtil.errorCode(res.code);
      }
    }, () => {
      SearchLyricUtil.toggleRhymeLoading(false, _this);
    });
  }
};

export default SearchLyricUtil;