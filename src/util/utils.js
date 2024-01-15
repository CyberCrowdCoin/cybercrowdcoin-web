export function debounce(func, wait) {
  //防抖
  let timer;
  // 在后续触发事件时，是直接触发的回调函数，不会去重新定义 timer
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, wait);
  };
}

export function copyText(text) {
  //新建一个文本框
  let oInput = document.createElement("input");
  //赋值给文本框
  oInput.value = text;
  document.body.appendChild(oInput);
  // 选择对象;
  oInput.select();
  // 执行浏览器复制命令
  document.execCommand("Copy");
  //复制完成删除掉输入框
  oInput.remove();
  this.$message.success('复制成功')
}

export function isSourceToken(address) {
  return address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
}

export function truncateString(str, maxLength) {
  if (str.length <= maxLength) {
    return str;
  }
  const mid = Math.floor((maxLength - 3));
  const start = str.slice(0, mid - 3);
  const end = str.slice(-mid - 3);

  return start + '...' + end;
}