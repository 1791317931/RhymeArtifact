let TimeUtil = {
  stringToArr(time) {
    return time.split(':');
  },
  stringToNumber(time) {
    let beatTimeArr = time.split(':');
    // 总时长
    return parseInt(beatTimeArr[0]) * 3600 + parseInt(beatTimeArr[1]) * 60 + parseInt(beatTimeArr[2]) * 1;
  },
  // 秒
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
  },
  getTimeStampByFormatTime(value, firstSplitCharactor = '-', secondSplitCharactor = ':') {
    if (!value) {
      return
    }

    // 先用空格分隔为yyyy-MM-dd  HH:mm:ss
    let arr = value.split(' '),
      date = new Date()
    let firstArr = arr[0].split(firstSplitCharactor),
      secondArr = null

    date.setFullYear(firstArr[0])
    // 月份要-1
    date.setMonth(parseInt(firstArr[1]) - 1)
    date.setDate(firstArr[2])

    if (arr[1]) {
      secondArr = arr[1].split(secondSplitCharactor)
      date.setHours(secondArr[0])

      if (secondArr[1]) {
        date.setMinutes(secondArr[1])
      } else {
        date.setMinutes(0)
      }

      if (secondArr[2]) {
        date.setSeconds(secondArr[2])
      } else {
        date.setSeconds(0)
      }

      if (secondArr[3]) {
        date.setMilliseconds(secondArr[3])
      } else {
        date.setMilliseconds(0)
      }
    } else {
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
    }

    return date.getTime()
  },
  getFormatTime(value, format, firstSplitCharactor = '-', secondSplitCharactor = ':') {
    let _format = format
    if (!_format) {
      _format = 'yyyy-MM-dd HH:mm:ss'
    }

    let year = value.getFullYear()
    let month = value.getMonth() + 1
    let day = value.getDate()
    let hour = value.getHours()
    let minute = value.getMinutes()
    let seconds = value.getSeconds()

    if (month < 10) {
      month = `0${month}`
    }

    if (day < 10) {
      day = `0${day}`
    }

    if (hour < 10) {
      hour = `0${hour}`
    }

    if (minute < 10) {
      minute = `0${minute}`
    }

    if (seconds < 10) {
      seconds = `0${seconds}`
    }

    let beforeArr = []
    if (_format.indexOf('yyyy') !== -1) {
      beforeArr.push(year)
    }

    if (_format.indexOf('MM') !== -1) {
      beforeArr.push(month)
    }

    if (_format.indexOf('dd') !== -1) {
      beforeArr.push(day)
    }

    let afterArr = []
    if (_format.indexOf('HH') !== -1) {
      afterArr.push(hour)
    }

    if (_format.indexOf('mm') !== -1) {
      afterArr.push(minute)
    }

    if (_format.indexOf('ss') !== -1) {
      afterArr.push(seconds)
    }

    let result = ''
    if (beforeArr.length) {
      result += beforeArr.join(firstSplitCharactor)
    }

    if (afterArr.length) {
      if (result) {
        result += ' '
      }
      result += afterArr.join(secondSplitCharactor)
    }

    return result
  }
};

export default TimeUtil;