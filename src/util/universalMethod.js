// 时间转换格式
const format_time_date = (d) => {
  if (d !== null) {
    var date = new Date(d);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var currentdate = y + "-" + m + "-" + d;
    var hh = date.getHours();
    hh = hh < 10 ? "0" + hh : hh;
    var mm = date.getMinutes();
    mm = mm < 10 ? "0" + mm : mm;
    var ss = date.getSeconds();
    ss = ss < 10 ? "0" + ss : ss;
    var time = hh + ":" + mm + ":" + ss;
    return currentdate + " " + time;
  }
};

export { format_time_date };
