let TimeUtil = {
  stringToArr(time) {
    return time.split(':');
  },
  stringToNumber(time) {
    let beatTimeArr = time.split(':');
    // 总时长
    return parseInt(beatTimeArr[0]) * 3600 + parseInt(beatTimeArr[1]) * 60 + parseInt(beatTimeArr[2]) * 1;
  },
  numberToArr(number) {
    let hours = parseInt(number / 3600) + '',
    surplusSeconds = number % 3600,
    minutes = parseInt(surplusSeconds / 60) + '',
    seconds = (surplusSeconds % 60) + '';

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    let arr = [];
    arr.push(hours, minutes, seconds);
    return arr;
  },
  numberToString(number) {
    return TimeUtil.numberToArr(number).join(':');
  }
};

export default TimeUtil;