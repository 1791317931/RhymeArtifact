let CreateMusicListUtil = {
  toggleMusicItemStatus(e, _this) {
    let index = e.currentTarget.dataset.index;
    _this.setData({
      [`createMusicPage.list[${index}].playing`]: !_this.data.createMusicPage.list[index].playing
    });
  },
  clickCollectionItem(e) {
    let index = e.currentTarget.dataset.index;
  },
  toRecord(e) {
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/create/record/index'
    });
  }
};

export default CreateMusicListUtil;