import TipUtil from '../TipUtil';
import PathUtil from '../PathUtil';
import DownloadUtil from '../DownloadUtil';

let PosterCanvasUtil = {
  // type：beat music
  draw(_this, data, type = 'beat') {
    let posterId = 'poster-canvas',
    context = wx.createCanvasContext(posterId),
    totalWidth = 610,
    totalHeight = 660,
    logoWidth = 144,
    logoHeight = 144,
    id = data.id;

    // 首先下载二维码
    wx.downloadFile({
      url: PathUtil.getPath('utils/qrcode-unlimited') + '?path=pages/main/index&type=' + type + '&id=' + id,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        let qrCodePath = res.tempFilePath;

        PosterCanvasUtil.drawLogo(context, '/assets/imgs/rect-logo.png', (totalWidth - logoWidth) / 2, 40, logoWidth, logoHeight);
        PosterCanvasUtil.fillAppName(context, totalWidth);
        PosterCanvasUtil.drawContent(context, data, type);
        PosterCanvasUtil.drawLine(context, totalWidth);
        PosterCanvasUtil.drawQrCodeInfo(context, qrCodePath);

        context.draw(false, (res) => {
          wx.canvasToTempFilePath({
            canvasId: posterId,
            fileType: 'jpg',
            quality: 0.92,
            success: (res) => {
              let path = res.tempFilePath;

              _this.setData({
                posterUrl: path
              });

              // 下载海报
              DownloadUtil.authorize(path);
            },
            fail(res) {
              console.log(res)
              // TipUtil.message('服务器繁忙，请稍后重试');
            }
          });
        });
      },
      fail: (res) => {
        console.log(res);
      }
    });
  },
  drawLogo(context, url, marginLeft, marginTop, width, height) {
    context.drawImage(url, marginLeft, marginTop, width, height);
  },
  fillAppName(context, totalWidth) {
    let fontSize = 32;
    context.setFillStyle('rgb(29, 29, 29)');
    context.setFontSize(fontSize);
    context.setTextAlign('center');
    let appName = getApp().globalData.appName;
    // 这里为了兼容中文和英文，所以距离上方的位置有所调整
    context.fillText(appName, totalWidth / 2, 204 + fontSize);
  },
  drawContent(context, data, type) {
    context.drawImage('/assets/imgs/disk.png', 65, 283, 133, 133);
    context.drawImage('/assets/imgs/to-play.png', 110, 318, 52, 54);

    let title, author, composer;
    if (type == 'music') {
      title = data.music_title;
      author = data.music_author;
      composer = data.beat_author || (data.beat && data.beat.beat_author) || '';
    } else if (type == 'beat') {
      title = data.beat_title;
      composer = data.beat_author;
    }

    if (title.length > 15) {
      title = title.substring(0, 15) + '...';
    }

    PosterCanvasUtil.fillTitle(context, title);
    let text = '',
    width = 0,
    // 可绘制区域长度
    totalWidth = 500;
    if (type == 'music') {
      text = '作者：' + author + '  作词：' + composer;
    } else if (type == 'beat') {
      text = '作词：' + composer;
    }

    for (let i = 0; i < text.length; i++) {
      width += context.measureText(text[i]).width;
      if (width >= totalWidth) {
        PosterCanvasUtil.fillAuthor(context, text.substring(0, i));
        break;
      } else if (i == text.length - 1) {
        PosterCanvasUtil.fillAuthor(context, text.substring(0, i));
      }
    }
  },
  fillTitle(context, title) {
    let fontSize = 32;
    context.setFillStyle('rgb(29, 29, 29)');
    context.setFontSize(fontSize);
    context.setTextAlign('left');
    context.fillText(title, 218, 299 + fontSize);
  },
  fillAuthor(context, info) {
    let fontSize = 24;
    context.setFillStyle('rgb(29, 29, 29)');
    context.setFontSize(fontSize);
    context.setTextAlign('left');
    context.fillText(info, 218, 354 + fontSize);
  },
  drawLine(context, width) {
    let y = 462;
    context.setStrokeStyle('rgb(216, 216, 216)');
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  },
  drawQrCodeInfo(context, url) {
    context.drawImage(url, 73, 503, 128, 128);

    let fontSize = 30;
    context.setFillStyle('rgb(29, 29, 29)');
    context.setFontSize(fontSize);
    context.setTextAlign('left');
    context.fillText('快来听听Ta的作品吧！', 239, 513 + fontSize);

    fontSize = 24;
    context.setFontSize(fontSize);
    context.setTextAlign('left');
    context.fillText('长按识别二维码获取完整版', 239, 579 + fontSize);
  }
};

export default PosterCanvasUtil;