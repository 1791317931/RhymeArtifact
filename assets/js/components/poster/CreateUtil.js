let CreateUtil = {
  // type：beat music
  draw(context, data, type, logoPath, qrCodePath) {
    let totalWidth = 610,
    totalHeight = 660,
    logoWidth = 144,
    logoHeight = 144;

    CreateUtil.drawLogo(context, logoPath, (totalWidth - logoWidth) / 2, 40, logoWidth, logoHeight);
    CreateUtil.fillAppName(context, totalWidth);
    CreateUtil.drawContent(context, data, type);
    CreateUtil.drawLine(context, totalWidth);
    CreateUtil.drawQrCodeInfo(context, qrCodePath);
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
      composer = data.user.data.nickname;
    } else if (type == 'beat') {
      title = data.beat_title;
      composer = data.beat_author;
    }

    if (title.length > 15) {
      title = title.substring(0, 15) + '...';
    }

    CreateUtil.fillTitle(context, title);
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
        // 画超出宽度前一个字
        CreateUtil.fillAuthor(context, text.substring(0, i));
        break;
      } else if (i == text.length - 1) {
        // 全部画下来
        CreateUtil.fillAuthor(context, text.substring(0, text.length));
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

export default CreateUtil;