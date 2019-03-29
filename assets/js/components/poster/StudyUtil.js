import PathUtil from '../../PathUtil';

let StudyUtil = {
  // type：video article
  draw(context, data, type, qrCodePath) {
    let totalWidth = 610,
    totalHeight = 660,
    logoWidth = 144,
    logoHeight = 144;

    StudyUtil.drawContent(context, data, type);
    StudyUtil.drawLine(context, totalWidth);
    StudyUtil.drawQrCodeInfo(context, qrCodePath);
  },
  drawContent(context, data, type) {
    if (type == 'video') {
      StudyUtil.drawVideoContent(context, data);
    } else {
      StudyUtil.drawArticleContent(context, data);
    }
  },
  drawVideoContent(context, data) {
    let poster,
    title;
    // 章节内容
    if (data.sectionId) {
      poster = PathUtil.getFilePath(data.section_cover);
      title = data.section_title;
    } else {
      // 封面内容
      poster = PathUtil.getFilePath(data.course_cover);
      title = data.course_title;
    }
    context.drawImage(poster, 0, 0, 610, 327);
    StudyUtil.fillTitle(context, title);
  },
  drawArticleContent(context, data) {
    let cover = PathUtil.getFilePath(data.cover),
    title = data.title;

    context.drawImage(cover, 0, 0, 610, 327);
    StudyUtil.fillTitle(context, title);
  },
  fillTitle(context, title) {
    let fontSize = 38;
    context.setFillStyle('rgb(29, 29, 29)');
    context.setFontSize(fontSize);
    context.setTextAlign('left');

    let maxWidth = 550,
    width = 0,
    lastIndex = 0,
    line = 0,
    lineHeight = 50,
    marginTop = 342,
    marginLeft = 30;

    for (let i = 0; i < title.length; i++) {
      width += context.measureText(title[i]).width;
      if (width >= maxWidth) {
        context.fillText(title.substring(0, i), marginLeft, marginTop + lineHeight * line + fontSize);
        lastIndex = i;
        // 行数
        line++;

        if (line == 2) {
          break;
        }
      } else if (i == title.length - 1) {
        context.fillText(title.substring(lastIndex, i), marginLeft, marginTop + lineHeight * line + fontSize);
      }
    }
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
    context.fillText('嘻哈圈学习都在这里', 239, 513 + fontSize);

    fontSize = 24;
    context.setFontSize(fontSize);
    context.setTextAlign('left');
    context.fillText('长按识别二维码获取完整版', 239, 579 + fontSize);
  }
};

export default StudyUtil;