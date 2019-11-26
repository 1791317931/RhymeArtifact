import UrlUtil from 'UrlUtil'
import PathUtil from 'PathUtil'

export function getAppStatus(fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath('wechat/review'), {
    version: 3
  }, fn, completeFn);
}

export function login(data, fn, completeFn) {
  UrlUtil.post(PathUtil.getNewPath('authorizations'), data, fn, completeFn);
}

export function bindUserPhone(data, fn, completeFn) {
  UrlUtil.post(PathUtil.getNewPath('wechat/getAuthPhone'), data, fn, completeFn);
}

export function getSystemStatus(fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath('auth/status'), null, fn, completeFn);
}

export function getPolicyParam(fn, completeFn, failFn) {
  UrlUtil.get('utils/oss-policy', null, fn, completeFn, failFn);
}

export function getNewPolicyParam(fn, completeFn, failFn) {
  UrlUtil.get(PathUtil.getNewPath('utils/oss-policy'), null, fn, completeFn, failFn);
}

export function saveFormId(data, fn, completeFn) {
  UrlUtil.post('utils/save-formid', data, fn, completeFn);
}

// 获取rap二维码
export function getRapQrcode(fn, completeFn, failFn) {
  UrlUtil.get('utils/wx-qrcode', null, fn, completeFn, failFn);
}

// 分类列表
export function getNewCategoryList(data, fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath('categories'), data, fn, completeFn);
}

export function getCategoryList(data, fn, completeFn) {
  UrlUtil.get('categories', data, fn, completeFn);
}

// 获取微信群信息
export function getWechatInfo(data, fn, completeFn) {
  UrlUtil.get(`utils/config/${data.key}`, data, fn, completeFn);
}

// ---------------------活动------------------------
export function getActivitySetting(data, fn, completeFn, failFn) {
  UrlUtil.get('activity/settings', data, fn, completeFn, failFn);
}
// ---------------------活动------------------------

// ---------------------收藏------------------------
export function getCollection(data, fn, completeFn) {
  UrlUtil.get('user/collections/' + data.type, data, fn, completeFn);
}

export function addCollection(data, fn, completeFn) {
  UrlUtil.post(`collections/${data.type}/${data.id}`, data, fn, completeFn);
}

export function deleteCollection(data, fn, completeFn) {
  UrlUtil.delete(`collections/${data.type}/${data.id}`, data, fn, completeFn);
}

export function getBeatCollection(data, fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath('user/collectionsBeats'), data, fn, completeFn);
}

export function getMusicCollection(data, fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath('user/collectionsMusics'), data, fn, completeFn);
}

export function addNewCollection(data, fn, completeFn) {
  UrlUtil.post(PathUtil.getNewPath(`collection`), data, fn, completeFn);
}

export function deleteNewCollection(data, fn, completeFn) {
  UrlUtil.post(PathUtil.getNewPath(`cancelCollection`), data, fn, completeFn);
}
// ---------------------收藏------------------------

// ---------------------分享------------------------
export function share(data, fn, completeFn) {
  UrlUtil.post(`shares/${data.type}/${data.id}`, data, fn, completeFn);
}
// ---------------------分享------------------------

// ---------------------点击------------------------
export function addClickNum(data, fn, completeFn) {
  UrlUtil.put(`${data.type}/${data.id}/click`, data, fn, completeFn);
}
// ---------------------点击------------------------

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
// ---------------------伴奏------------------------

// ---------------------创作------------------------
export function createMusic(data, fn, completeFn) {
  UrlUtil.post('musics', data, fn, completeFn);
}

export function getMusicById(data, fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath(`musics/${data.id}`), data, fn, completeFn);
}

export function getMusicPage(data, fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath('musics'), data, fn, completeFn);
}
// ---------------------创作------------------------

// ---------------------学习------------------------
export function getStudyPage(data, fn, completeFn) {
  UrlUtil.get(data.type, data, fn, completeFn);
}

export function getVideoById(data, fn, completeFn) {
  UrlUtil.get(`courses/${data.id}`, data, fn, completeFn);
}

export function getArticleById(data, fn, completeFn) {
  UrlUtil.get(`posts/${data.id}`, data, fn, completeFn);
}

export function buyCourseById(data, fn, completeFn) {
  UrlUtil.post(`courses/${data.courseId}/buy`, data, fn, completeFn);
}
// ---------------------学习------------------------

// ---------------------freestyle------------------------
export function getFreestyleTheme(data, fn, completeFn) {
  UrlUtil.get('freestyle/theme/rand', data, fn, completeFn);
}

export function addFreestylePick(data, fn, completeFn) {
  UrlUtil.put(`freestyles/${data.id}/pick`, data, fn, completeFn);
}

export function addFreestyle(data, fn, completeFn) {
  UrlUtil.post('freestyles', data, fn, completeFn);
}

export function deleteFreestyleById(data, fn, completeFn) {
  UrlUtil.delete(`freestyles/${data.id}`, data, fn, completeFn);
}

export function getFreestyleById(data, fn, completeFn) {
  UrlUtil.get(`freestyles/${data.id}`, data, fn, completeFn);
}

// 获取某人的fs
export function getFreestylePage(data, fn, completeFn) {
  UrlUtil.get(`freestyles`, data, fn, completeFn);
}

// 周榜
export function getFreestyleWeekRank(data, fn, completeFn) {
  UrlUtil.get(`freestyle-activity/week-rank`, data, fn, completeFn);
}

export function getFreestyleTopRank(data, fn, completeFn) {
  UrlUtil.get(`freestyle-activity/rank`, data, fn, completeFn);
}

export function getMyFreestylePage(data, fn, completeFn) {
  UrlUtil.get(`user/freestyles`, data, fn, completeFn);
}

export function addFreestyleComment(data, fn, completeFn) {
  UrlUtil.post(`freestyles/${data.freestyleId}/comments`, data, fn, completeFn);
}

export function deleteFreestyleComment(data, fn, completeFn) {
  UrlUtil.delete(`freestyles/comments/${data.commentId}`, data, fn, completeFn);
}

export function getFreestyleCommentPage(data, fn, completeFn) {
  UrlUtil.get(`freestyles/${data.objectId}/comments`, data, fn, completeFn);
}

export function addFreestyleCommentPraise(data, fn, completeFn) {
  UrlUtil.put(`freestyles/comments/${data.commentId}/like`, data, fn, completeFn);
}

export function deleteFreestyleCommentPraise(data, fn, completeFn) {
  UrlUtil.put(`freestyles/comments/${data.commentId}/cancelLike`, data, fn, completeFn);
}
// ---------------------freestyle------------------------

// ---------------------用户------------------------
export function getMyInfo(data, fn, completeFn) {
  UrlUtil.get(`users`, data, fn, completeFn);
}

export function getUserById(data, fn, completeFn) {
  UrlUtil.get(`users/${data.id}`, data, fn, completeFn);
}

export function follow(data, fn, completeFn) {
  UrlUtil.post(`fans`, data, fn, completeFn);
}

export function cancelFollow(data, fn, completeFn) {
  UrlUtil.delete(`fans/user-id/${data.user_id}`, data, fn, completeFn);
}

export function getFansPage(data, fn, completeFn) {
  UrlUtil.get(`fans`, data, fn, completeFn);
}

export function getUserInfoByToken(fn, completeFn) {
  UrlUtil.post(PathUtil.getNewPath(`getUserInfoByToken`), null, fn, completeFn);
}

export function updateUser(data, fn, completeFn) {
  UrlUtil.put(PathUtil.getNewPath(`user-info`), data, fn, completeFn);
}

export function getMyIncomePage(data, fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath(`user/income`), data, fn, completeFn);
}
// ---------------------用户------------------------

// ---------------------商品------------------------
export function getGoodsPage(data, fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath(`goods`), data, fn, completeFn);
}

export function getGoodsById(data, fn, completeFn) {
  UrlUtil.get(`goods/${data.id}`, data, fn, completeFn);
}

export function buyGoodsById(data, fn, completeFn) {
  UrlUtil.post(`goods/${data.id}/buy`, data, fn, completeFn);
}
// ---------------------商品------------------------

// ---------------------收货地址------------------------
export function getAddressList(data, fn, completeFn) {
  UrlUtil.get(`user/addresses`, data, fn, completeFn);
}

export function addAddress(data, fn, completeFn) {
  UrlUtil.post(`addresses`, data, fn, completeFn);
}

export function deleteAddress(data, fn, completeFn) {
  UrlUtil.delete(`addresses/${data.id}`, data, fn, completeFn);
}

export function setDefaultAddress(data, fn, completeFn) {
  UrlUtil.post(`user/addresses/default/${data.id}`, data, fn, completeFn);
}

export function getDefaultAddress(data, fn, completeFn) {
  UrlUtil.get(`user/addresses/default`, data, fn, completeFn);
}
// ---------------------收货地址------------------------

// ---------------------订单------------------------
export function buyGoods(data, fn, completeFn) {
  UrlUtil.post(PathUtil.getNewPath('goods/pay'), data, fn, completeFn);
}

export function getOrderPage(data, fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath('orderLists'), data, fn, completeFn);
}

export function getOrderDetail(data, fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath(`orderDetail/${data.id}`), data, fn, completeFn);
}
// ---------------------订单------------------------

// ---------------------评论------------------------
export function addNewComment(data, fn, completeFn) {
  UrlUtil.post(PathUtil.getNewPath(`comments`), data, fn, completeFn);
}

export function deleteNewComment(data, fn, completeFn) {
  UrlUtil.delete(PathUtil.getNewPath(`comments/${data.id}`), data, fn, completeFn);
}

export function getNewCommentPage(data, fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath(`comments`), data, fn, completeFn);
}
// ---------------------评论------------------------

// ---------------------圈内文章------------------------
export function getNewArticlePage(data, fn, completeFn) {
  UrlUtil.get(PathUtil.getNewPath(`posts`), data, fn, completeFn);
}
// ---------------------圈内文章------------------------