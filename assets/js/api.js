import UrlUtil from 'UrlUtil';

export function login(data, fn, completeFn) {
  UrlUtil.post('authorizations', data, fn, completeFn);
}

export function uploadFile(data, fn, completeFn) {
  UrlUtil.post('upload-file', data, fn, completeFn);
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
  UrlUtil.get('lyrics', data, fn, completeFn);
}
// ---------------------歌词------------------------

// ---------------------伴奏------------------------
export function getBeatPage(data, fn, completeFn) {
  UrlUtil.get('beats', data, fn, completeFn);
}

export function collectBeat(data, fn, completeFn) {
  UrlUtil.post('collection/beat/' + data.id, data, fn, completeFn);
}

export function deleteBeat(data, fn, completeFn) {
  UrlUtil.delete('collection/beat/' + data.id, data, fn, completeFn);
}

export function shareBeat(data, fn, completeFn) {
  UrlUtil.post('shares/beat/' + data.id, data, fn, completeFn);
}
// ---------------------伴奏------------------------

// ---------------------创作------------------------
export function createMusic(data, fn, completeFn) {
  UrlUtil.post('music-create', data, fn, completeFn);
}

export function getMusicPage(data, fn, completeFn) {
  UrlUtil.get('musics', data, fn, completeFn);
}

export function getMyMusicPage(data, fn, completeFn) {
  UrlUtil.get('user/musics', data, fn, completeFn);
}

export function collectMusic(data, fn, completeFn) {
  UrlUtil.post('collection/music/' + data.id, data, fn, completeFn);
}

export function deleteMusic(data, fn, completeFn) {
  UrlUtil.delete('collection/music/' + data.id, data, fn, completeFn);
}

export function removeMusic(data, fn, completeFn) {
  UrlUtil.post('music-delete', data, fn, completeFn);
}

export function shareMusic(data, fn, completeFn) {
  UrlUtil.post('shares/music/' + data.id, data, fn, completeFn);
}

export function getCollection(data, fn, completeFn) {
  UrlUtil.get('collections', data, fn, completeFn);
}
// ---------------------创作------------------------