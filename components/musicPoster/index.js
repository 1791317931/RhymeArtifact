import TipUtil from '../../assets/js/TipUtil';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    objData: Object,
    posterId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    posterUrl: null
  },
  attached() {
    this.draw();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    draw() {
      let posterId = this.data.posterId,
      context = wx.createCanvasContext(posterId),
      totalWidth = 610,
      totalHeight = 660,
      logoWidth = 144,
      logoHeight = 144;

      this.drawLogo(context, '/assets/imgs/rect-logo.png', (totalWidth - logoWidth) / 2, 40, logoWidth, logoHeight);
      this.fillAppName(context, totalWidth);
      this.drawContent(context);
      this.drawLine(context, totalWidth);
      this.drawQrCodeInfo(context, '/assets/imgs/rect-logo.png');

      context.draw(false, (res) => {
        wx.canvasToTempFilePath({
          canvasId: posterId,
          fileType: 'jpg',
          quality: 0.92,
          success: (res) => {
            let path = res.tempFilePath;

            this.setData({
              posterUrl: path
            });
            // fn && fn(compressedPath, path);
          },
          fail(res) {
            console.log(res)
            // TipUtil.message('服务器繁忙，请稍后重试');
          }
        });
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
    drawContent(context) {
      context.drawImage('/assets/imgs/disk.png', 65, 283, 133, 133);
      context.drawImage('/assets/imgs/to-play.png', 110, 318, 52, 54);

      let objData = this.data.objData;
      objData = {
        title: '秋风落叶秋风落叶秋风落叶gfh',
        author: '李大伟111',
        composer: '小青龙1111'
      };
      let title = objData.title,
      author = objData.author,
      composer = objData.composer;

      if (title.length > 10) {
        title = title.substring(0, 10) + '...';
      }

      if (author.length > 3) {
        author = author.substring(0, 3) + '...';
      }

      if (composer.length > 3) {
        composer = composer.substring(0, 3) + '...';
      }

      this.fillTitle(context, title);
      this.fillAuthor(context, '作者：' + author, '作词：' + composer);
    },
    fillTitle(context, title) {
      let fontSize = 32;
      context.setFillStyle('rgb(29, 29, 29)');
      context.setFontSize(fontSize);
      context.setTextAlign('left');
      context.fillText(title, 218, 299 + fontSize);
    },
    fillAuthor(context, authorInfo, composerInfo) {
      let fontSize = 24;
      context.setFillStyle('rgb(29, 29, 29)');
      context.setFontSize(fontSize);
      context.setTextAlign('left');
      context.fillText(authorInfo + '  ' + composerInfo, 218, 354 + fontSize);
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
  }
})
