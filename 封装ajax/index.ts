const noop = () => {}
let defaults = {
  type: 'GET', // 请求类型
  async: true, // 是否异步执行
  headers: {}, // 请求头信息
  timeout: 0, // 超时时间
  data: null, // 传递数据
  readystatechange: noop, //  readyState 属性发生变化时执行事件
  abort: noop, // 请求停止时执行事件
  error: noop, // 请求失败后执行事件
  load: noop, // 请求完成后执行事件
  loadstart: noop, // 接收到响应数据时执行事件
  loadend: noop, // 请求结束时执行事件
  progress: noop, // 请求接收到更多数据时执行事件
  overtime: noop, // 请求超时执行事件
}

// 封装xhr请求
function ajax(url: string, options?: Options) {
  const config = Object.assign({}, defaults, options)
  const xhr = new XMLHttpRequest()
  xhr.open(config.type, url, config.async)
  // 设置请求头
  for (const key in config.headers) {
    xhr.setRequestHeader(key, config.headers[key])
  }
  // 注册事件
  const events = ['readystatechange', 'abort', 'error', 'load', 'loadstart', 'loadend', 'progress', 'overtime']
  for (const event of events) {
    xhr.addEventListener(event, () => {
      config[event](xhr)
    })
  }
  xhr.send(config.data)

  // 返回一个终止请求的函数
  return function () {
    xhr.abort()
  }
}

// 默认的检测成功请求的函数
const checkSuccess = (res: Response | XMLHttpRequest): boolean =>
  (res.status >= 200 && res.status < 300) || res.status === 304
// 自动重发
function autoResend(url: string, options: Options = {}, count = 0, isSuccess = checkSuccess): () => void {
  // 通过结束事件检测是否成功，默认依照状态码判断
  const preLoadend = options.loadend
  options.loadend = (xhr: XMLHttpRequest) => {
    if (preLoadend) {
      preLoadend(xhr)
    }
    // 错误重发
    if (!isSuccess(xhr) && count > 0) {
      abort = autoResend(url, options, count - 1, isSuccess)
      count = 0
    }
  }

  let abort
  abort = ajax(url, options)
  // 返回一个终止请求的函数
  return () => {
    count = 0 // 数字置0，避免重发
    abort()
  }
}

// 使用promise时，一般不会绑定事件函数
// 简单的promise封装，一定会返回解决的promise
function ajaxWithPromise(url: string, options: Options = {}) {
  return new Promise((resolve, reject) => {
    options.loadend = (xhr: XMLHttpRequest) => {
      resolve(xhr)
    }
    ajax(url, options)
  })
}
// 封装fetch重发功能
function autoResendFetch(url: string, config?: RequestInit, count = 0, isSuccess = checkSuccess) {
  return fetch(url, config).then(
    (response) => {
      if (count > 0 && !isSuccess(response)) {
        return autoResendFetch(url, config, count - 1, isSuccess)
      } else {
        return response
      }
    },
    (err) => {
      if (count > 0) {
        return autoResendFetch(url, config, count - 1, isSuccess)
      } else {
        return Promise.reject(err)
      }
    }
  )
}

type AjaxHandler = (() => void) | ((xhr: XMLHttpRequest) => void)
interface Options {
  type?: string
  async?: boolean
  headers?: { [propName: string]: string }
  timeout?: number
  data?: any
  readystatechange?: AjaxHandler
  abort?: AjaxHandler
  error?: AjaxHandler
  load?: AjaxHandler
  loadstart?: AjaxHandler
  loadend?: AjaxHandler
  progress?: AjaxHandler
  overtime?: AjaxHandler
}
