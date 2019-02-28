import UrlUtil from 'UrlUtil';

export function getRhymeList(data, fn, completeFn) {
  UrlUtil.post('get-rhyme-lists', data, fn, completeFn);
}