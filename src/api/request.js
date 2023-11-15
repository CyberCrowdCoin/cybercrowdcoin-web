import axios from "axios";
import { isValidVariable, isValidObject } from "./basic-verify";

/*axios  get 请求
 * @param url 请求url
 * @param params 请求参数对象 Object
 * @param resFunc 成功后的回调函数
 */
const requestGet = (parameters) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token") || ""; // 替换为实际的认证令牌
  axios.defaults.headers.post["Content-Type"] = "application/json";
  const { url, params, resFunc, errFunc } = parameters;
  axios
    .get(url, {
      params,
    })
    .then((response) => {
      resFunc(response);
    })
    .catch((err) => {
      if (typeof errFunc == "function") {
        errFunc(err);
      }
      console.error(err);
    });
};

/*axios  get 请求
 * @param url 请求url
 * @param type 请求类型  POST PUT DELETE
 * @param params 请求参数对象 Object
 * @param resFunc 成功后的回调函数
 * @param errFunc 失败后的回调函数
 *
 */
const request = (parameters) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("token") || ""; // 替换为实际的认证令牌
  axios.defaults.headers.post["Content-Type"] = "application/json";
  const {
    url,
    method,
    params,
    resFunc,
    errFunc,
    headers = "application/json; charset=utf-8;",
  } = parameters;
  axios({
    method,
    url,
    data: params,
    headers: {
      "Content-Type": headers,
    },
  })
    .then((response) => {
      // const data = response.data;
      // console.log(response, 123);
      // if (isValidObject(data) && isValidVariable(data.status)) {
      resFunc(response);

      // } else if (typeof errFunc == "function") {
      //   if (
      //     isValidObject(data) &&
      //     isValidObject(data.error) &&
      //     isValidVariable(data.error.message)
      //   ) {
      //     errFunc(data.error.message);
      //   } else {
      //     errFunc("");
      //   }
      // }
    })
    .catch((err) => {
      console.log(err, 456);
      if (typeof errFunc == "function") {
        errFunc(err);
      }
    });
};

const ins = axios.create();
// 第三步，响应阻拦
ins.interceptors.response.use(
  function (response) {
    const resStatus = response.status;
    if (resStatus === 200) {
      const data = response.data;
      if (
        isValidObject(data) &&
        (isValidVariable(data.status) || isValidVariable(data.code))
      ) {
        let status = data.status ? data.status : data.code;

        if (status * 1 === 200) {
          return Promise.resolve(data);
        } else {
          const error = data.error || {};
          const message = error.message || "";
          return Promise.reject(message);
        }
      }
    }
  },
  function (error) {
    // 响应错误处理
    return Promise.reject(error);
  }
);

//无需传入回调，用promise
const requestGet2 = async ({ url, params }) => {
  return ins.get(url, {
    params,
  });
};

const request2 = async (parameters) => {
  const {
    url,
    method = "POST",
    params,
    headers = "application/json; charset=utf-8",
  } = parameters;
  return ins({
    method,
    url,
    data: params,
    headers: {
      "Content-Type": headers,
    },
  });
};

const requestExcel = (parameters) => {
  const {
    url,
    method,
    params,
    resFunc,
    errFunc,
    headers = "application/json; charset=utf-8;responseType=arraybuffer",
  } = parameters;
  axios({
    method,
    url,
    data: params,
    responseType: "blob",
    headers: {
      "Content-Type": headers,
      accesstoken: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      resFunc(response);
    })
    .catch((err) => {
      console.log(err, 456);
      if (typeof errFunc == "function") {
        errFunc(err);
      }
    });
};

export { requestExcel, requestGet, request, requestGet2, request2 };
