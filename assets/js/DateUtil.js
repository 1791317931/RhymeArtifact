let DateUtil = {
  getFormatTime(value, format, firstSplitCharactor = '-', secondSplitCharactor = ':') {
    if (!format) {
      format = 'yyyy-MM-dd HH:mm';
    }

    let year = value.getFullYear();
    let month = value.getMonth() + 1;
    let day = value.getDate();
    let hour = value.getHours();
    let minute = value.getMinutes();
    let seconds = value.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    if (hour < 10) {
      hour = '0' + hour;
    }

    if (minute < 10) {
      minute = '0' + minute;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    let beforeArr = [];
    if (format.indexOf('yyyy') != -1) {
      beforeArr.push(year);
    }

    if (format.indexOf('MM') != -1) {
      beforeArr.push(month);
    }

    if (format.indexOf('dd') != -1) {
      beforeArr.push(day);
    }

    let afterArr = [];
    if (format.indexOf('HH') != -1) {
      afterArr.push(hour);
    }

    if (format.indexOf('mm') != -1) {
      afterArr.push(minute);
    }

    if (format.indexOf('ss') != -1) {
      afterArr.push(seconds);
    }

    let result = '';
    if (beforeArr.length) {
      result += beforeArr.join(firstSplitCharactor);
    }

    if (afterArr.length) {
      if (result) {
        result += ' ';
      }
      result += afterArr.join(secondSplitCharactor);
    }

    return result;
  }
};

export default DateUtil;