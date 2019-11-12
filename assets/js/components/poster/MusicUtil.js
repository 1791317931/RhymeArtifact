let CreateUtil = {
  draw(context, posterId, data, qrCodePath) {
    let totalWidth = 540
    let totalHeight = 750
    let imgWidth = 540
    let imgHeight = 540
    let qrWidth = 117
    let qrHeight = 117
    let appNameWidth = 127
    let appNameHeight = 20
    const coverImg = data.musics_cover

    CreateUtil.fillImage(context, coverImg, 0, 0, imgWidth, imgHeight);
    CreateUtil.fillAppName(context, '/assets/imgs/create/app-name.png', (totalWidth - appNameWidth) / 2, 710, appNameWidth, appNameHeight);
    CreateUtil.drawContent(context, posterId, data);
    CreateUtil.drawQrCodeInfo(context, qrCodePath, 397, 570, qrWidth, qrHeight);
  },
  fillImage(context, url, marginLeft, marginTop, width, height) {
    context.drawImage(url, marginLeft, marginTop, width, height);
  },
  fillAppName(context, url, marginLeft, marginTop, width, height) {
    context.drawImage(url, marginLeft, marginTop, width, height);
  },
  drawContent(context, posterId, data) {
    // context.draw(false, () => {
    //   wx.canvasGetImageData({
    //     canvasId: posterId,
    //     x: 0,
    //     y: 0,
    //     width: 10,
    //     height: 10,
    //     success(res) {
    //       console.log(res)
    //     }
    //   })
    // })
    



    let title, author, composer;
    title = data.music_title;
    composer = data.lyricist

    context.setFontSize(28);
    let text = title
    let titleWidth = 0
    // 可绘制区域长度
    let totalWidth = 300
    for (let i = 0; i < text.length; i++) {
      titleWidth += context.measureText(text[i]).width;
      if (titleWidth >= totalWidth) {
        // 画超出宽度前一个字
        CreateUtil.fillTitle(context, text.substring(0, i) + '...');
        break;
      } else if (i == text.length - 1) {
        // 全部画下来
        CreateUtil.fillTitle(context, text.substring(0, text.length));
      }
    }

    CreateUtil.fillAuthor(context, composer);
  },
  fillTitle(context, title) {
    let fontSize = 28;
    context.setFillStyle('rgb(0, 0, 0)');
    context.setFontSize(fontSize);
    context.setTextAlign('left');
    context.fillText(title, 27, 572 + fontSize);
  },
  fillAuthor(context, info) {
    let fontSize = 24;
    context.setFillStyle('rgb(0, 0, 0)');
    context.setFontSize(fontSize);
    context.setTextAlign('left');
    context.fillText(info, 27, 616 + fontSize);
  },
  drawQrCodeInfo(context, url, marginLeft, marginTop, width, height) {
    context.drawImage(url, marginLeft, marginTop, width, height);
  }
};

export default CreateUtil;