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
  },
  friendlyTime(time) {
    let date = (typeof time === 'number') ? new Date(time) : new Date((time || '').replace(/-/g, '/')),
      diff = (((new Date()).getTime() - date.getTime()) / 1000),
      dayDiff = Math.floor(diff / 86400)

    let isValidDate = Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())

    if (!isValidDate) {
      console.error('not a valid date')
    }
    const formatDate = function (date) {
      let today = new Date(date),
        year = today.getFullYear(),
        month = ('0' + (today.getMonth() + 1)).slice(-2),
        day = ('0' + today.getDate()).slice(-2),
        hour = ('0' + today.getHours()).slice(-2),
        minute = ('0' + today.getMinutes()).slice(-2),
        second = today.getSeconds()
      return `${year}-${month}-${day} ${hour}:${minute}`
    }

    if (isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
      return formatDate(date);
    }

    return dayDiff === 0 && (
      diff < 60 && '刚刚' ||
      diff < 120 && '1分钟前' ||
      diff < 3600 && Math.floor(diff / 60) + '分钟前' ||
      diff < 7200 && '1小时前' ||
      diff < 86400 && Math.floor(diff / 3600) + '小时前') ||
      dayDiff === 1 && '昨天' ||
      dayDiff < 7 && dayDiff + '天前' ||
      dayDiff < 31 && Math.ceil(dayDiff / 7) + '周前'
  }
};

export default DateUtil;