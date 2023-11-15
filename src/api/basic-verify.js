//基础校验规则
/**
 * 判断是否为有效变量
 */
const isValidVariable = (variable) => {
  if (variable !== undefined && variable !== null && variable !== "null") {
    if (typeof variable === "string") {
      if (variable.trim() !== "") {
        return true;
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
};
/**
 * 判断是否为对象类型且有值()
 */
const isValidObject = (variable) => {
  //null undefined "" 0 NaN
  if (variable) {
    if (typeof variable === "object" && !(variable instanceof Array)) {
      for (let key in variable) {
        if (key) {
          return true;
        }
      }
    }
  }
  return false;
};

export { isValidVariable, isValidObject };
