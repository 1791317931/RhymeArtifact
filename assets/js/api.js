import UrlUtil from 'UrlUtil';

export function login(data, fn, completeFn) {
  UrlUtil.post('authorizations', data, fn, completeFn);
}

export function getPolicyParam(fn, completeFn, failFn) {
  UrlUtil.get('utils/oss-policy', null, fn, completeFn, failFn);
}

// ---------------------词汇------------------------
export function getRhymeList(data, fn, completeFn) {
  UrlUtil.get('utils/rhyme', data, fn, completeFn);
}
// ---------------------词汇------------------------

// ---------------------歌词------------------------
export function getLyricById(data, fn, completeFn) {
  UrlUtil.get('lyrics/' + data.lyric_id, data, fn, completeFn);
}

export function createLyric(data, fn, completeFn) {
  UrlUtil.post('lyrics', data, fn, completeFn);
}

export function updateLyricById(data, fn, completeFn) {
  UrlUtil.put('lyrics/' + data.id, data, fn, completeFn);
}

export function deleteLyricById(data, fn, completeFn) {
  UrlUtil.delete('lyrics/' + data.lyric_id, data, fn, completeFn);
}

export function getLyricPage(data, fn, completeFn) {
  UrlUtil.get('user/lyrics', data, fn, completeFn);
}
// ---------------------歌词------------------------

// ---------------------伴奏------------------------
export function getBeatPage(data, fn, completeFn) {
  UrlUtil.get('beats', data, fn, completeFn);
}

export function addBeatCollection(data, fn, completeFn) {
  UrlUtil.post('collections/beat/' + data.id, data, fn, completeFn);
}

export function deleteBeatCollection(data, fn, completeFn) {
  UrlUtil.delete('collections/beat/' + data.id, data, fn, completeFn);
}

export function shareBeat(data, fn, completeFn) {
  UrlUtil.post('shares/beat/' + data.id, data, fn, completeFn);
}
// ---------------------伴奏------------------------

// ---------------------创作------------------------
export function createMusic(data, fn, completeFn) {
  UrlUtil.post('musics', data, fn, completeFn);
}

export function getMusicPage(data, fn, completeFn) {
  UrlUtil.get('musics', data, fn, completeFn);
}

export function getMyMusicPage(data, fn, completeFn) {
  UrlUtil.get('user/musics', data, fn, completeFn);
}

export function addMusicCollection(data, fn, completeFn) {
  UrlUtil.post('collections/music/' + data.id, data, fn, completeFn);
}

export function deleteMusicCollection(data, fn, completeFn) {
  UrlUtil.delete('collections/music/' + data.id, data, fn, completeFn);
}

export function removeMusic(data, fn, completeFn) {
  UrlUtil.delete('musics/' + data.id, data, fn, completeFn);
}

export function shareMusic(data, fn, completeFn) {
  UrlUtil.post('shares/music/' + data.id, data, fn, completeFn);
}

export function getCollection(data, fn, completeFn) {
  UrlUtil.get('collections', data, fn, completeFn);
}
// ---------------------创作------------------------