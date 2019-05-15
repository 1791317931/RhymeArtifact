import TipUtil from './TipUtil';

let DownloadUtil = {
  // 查看授权
  authorize(url, callback) {
    if (url) {
      wx.getSetting({
        success: (res) => {
          let grant = 'scope.writePhotosAlbum';
          if (!res.authSetting[grant]) {
            wx.authorize({
              scope: grant,
              success: (res) => {
                // 必须是授权成功，才能下载图片
                DownloadUtil.download(url, callback);
              },
              fail: (res) => {
                // 上一次被拒绝了，再次弹出询问框--注意：开发者工具是不会进入这里的
                if (['authorize:fail', 'authorize:fail auth deny'].indexOf(res.errMsg) != -1) {
                  TipUtil.message('由于您拒绝了授权申请，短期内不能再保存了！稍后再做一次吧~');
                }
              },
              complete: () => {

              }
            });
          } else {
            // 以前同意过，不需要授权
            DownloadUtil.download(url, callback);
          }
        },
        complete: (res) => {
          // console.log(res);
        }
      });
    } else {
      TipUtil.message('图片加载失败，请稍后重试');
    }
  },
  // 下载文件
  download(url, callback) {
    wx.showLoading({
      title: '图片保存中',
    });

    // 还需要将https转换为本地图片，http不考虑，直接默认是本地图片
    if (/^https/.test(url)) {
      wx.downloadFile({
        url,
        success: (res) => {
          let tempFilePath = res.tempFilePath;
          DownloadUtil.authorize(tempFilePath);
        }
      });
    } else {
      DownloadUtil.saveImageToPhotosAlbum(url, callback);
    }
  },
  saveImageToPhotosAlbum(filePath, callback) {
    // 保存到本地
    wx.saveImageToPhotosAlbum({
      filePath,
      success(res) {
        TipUtil.message('保存成功');
        callback && callback();
      },
      fail(res) {
        // if (['saveImageToPhotosAlbum:fail cancel', 'saveImageToPhotosAlbum:fail: auth denied'].indexOf(res.errMsg) == -1) {
        //   TipUtil.message('图片保存失败');
        // }
        console.log(res);
      },
      complete(res) {
        wx.hideLoading();
      }
    });
  }
};

export default DownloadUtil;