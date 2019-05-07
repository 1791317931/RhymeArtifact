import TimeUtil from '../../TimeUtil';

let FreestyleUtil = {
  draw(context, data, qrCodePath) {
    let totalWidth = 750,
    totalHeight = 1334;

    FreestyleUtil.drawBackgroundImage(context, totalWidth, totalHeight, data.backgroundImage);
    FreestyleUtil.fillThemeName(context, totalWidth, data.title);
    FreestyleUtil.drawProgress(context, data);
    FreestyleUtil.drawInfo(context, data);
    FreestyleUtil.drawQrCodeInfo(context, qrCodePath);
  },
  roundRectColor(context, fillStyle, strokeStyle, x, y, w, h, r) {
    context.save();
    context.setFillStyle(fillStyle);
    context.setStrokeStyle(strokeStyle);
    // 交点设置成圆角
    context.setLineJoin('round');
    context.setLineWidth(r);
    context.strokeRect(x + r / 2, y + r / 2, w - r, h - r);
    context.fillRect(x + r, y + r, w - r * 2, h - r * 2);
    context.stroke();
    context.closePath();
  },
  drawBackgroundImage(context, totalWidth, totalHeight, backgroundImage) {
    context.drawImage(backgroundImage, 0, 0, totalWidth, totalHeight);
  },
  fillThemeName(context, totalWidth, title) {
    let fontSize = 42;
    context.setFillStyle('rgb(255, 255, 255)');
    context.setFontSize(fontSize);
    context.setTextAlign('center');
    // 这里为了兼容中文和英文，所以距离上方的位置有所调整
    context.fillText('Freestyle主题：' + title, totalWidth / 2, 613 + fontSize + 9);
  },
  drawProgress(context, data) {
    let fontSize = 22;
    context.setFontSize(fontSize);

    let textWidth = context.measureText('01:00').width,
    w = 544,
    h = 10,
    r = 9,
    x = (750 - w - 40 * 2 - textWidth * 2) / 2 + 40 + textWidth,
    y = 714;

    context.setFillStyle('transparent');
    context.fillRect(104, 712, w, h);
    FreestyleUtil.roundRectColor(context, 'rgba(255, 255, 255, .2)', 'rgba(255, 255, 255, .2)', x, y, w, h, r);

    let width = (data.playTime / data.duration) * w;
    if (width) {
      FreestyleUtil.roundRectColor(context, '#fff', '#fff', x, y, width, h, r);
    }

    context.setFillStyle('rgb(255, 255, 255)');
    context.setTextAlign('left');

    let playTimeArr = data.playTimeArr;
    context.fillText(playTimeArr[1] + ':' + playTimeArr[2], 40, 702 + fontSize + 4);

    let totalTimeArr = data.totalTimeArr,
    totalTimeString = totalTimeArr[1] + ':' + totalTimeArr[2],
    totalTimeMarginLeft = x + w + (x - textWidth - 40);
    context.fillText(totalTimeString, totalTimeMarginLeft, 702 + fontSize + 4);

    // 关注
    let followWidth = 113,
    followMarginLeft = totalTimeMarginLeft + textWidth - followWidth;
    context.drawImage('/assets/imgs/follow-btn.png', followMarginLeft, 775, followWidth, 52);
  },
  drawInfo(context, data) {
    FreestyleUtil.drawAuthorImage(context, data.user);
    FreestyleUtil.fillInfo(context, data);
  },
  drawAuthorImage(context, user) {
    let width = 80,
    height = 80,
    marginLeft = 40,
    marginTop = 762;

    // 画头像
    context.save();
    context.arc(marginLeft + width / 2, marginTop + height / 2, width / 2, 0, 2 * Math.PI);
    context.clip();
    context.drawImage(user.avatarUrl, marginLeft, marginTop, width, height);
    context.restore();
  },
  fillInfo(context, data) {
    let fontSize = 30,
    user = data.user;

    context.setFillStyle('rgb(255, 255, 255)');
    context.setFontSize(fontSize);
    context.setTextAlign('left');
    context.fillText(user.nickname, 142, 762 + fontSize + 3);

    fontSize = 22;
    context.setFillStyle('rgb(148, 154, 161)');
    context.setFontSize(fontSize);
    context.fillText(data.created_at, 142, 811 + fontSize + 4);
  },
  drawQrCodeInfo(context, url) {
    // let w = 300,
    // h = 300,
    // r = 58;

    // 设置纯色填充
    // context.save();
    // context.beginPath();
    // context.setFillStyle('transparent');
    // context.fillRect(225, 914, w, h);
    // FreestyleUtil.roundRectColor(context, 'transparent', '#fff', 225, 914, w, h, r);
    // context.drawImage(url, 258, 948, 234, 234);
    // context.restore();
    context.drawImage(url, 258, 948, 234, 234);
  }
};

export default FreestyleUtil;