import UrlUtil from 'UrlUtil';

export function login(data, fn, completeFn) {
  UrlUtil.post('wx-login', data, fn, completeFn);
}

// ---------------------词汇------------------------
export function getRhymeList(data, fn, completeFn) {
  UrlUtil.post('get-rhyme-lists', data, fn, completeFn);
}
// ---------------------词汇------------------------

// ---------------------歌词列表------------------------
export function getLyricPage(data, fn, completeFn) {
  UrlUtil.post('lyric-lists', data, fn, completeFn);
}
// ---------------------歌词列表------------------------