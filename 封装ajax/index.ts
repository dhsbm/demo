const noop = () => {}
const defaults = {
  url: '', // 请求地址
  type: 'GET', // 请求类型
  async: true, // 是否异步执行
  headers: {}, // 请求头信息
  timeout: 0, // 超时时间
  data: null, // 传递数据
  readystatechange: noop, //  readyState 属性发生变化时执行事件
  abort: noop, // 请求停止时执行事件
  error: noop, // 请求失败后执行事件
  load: noop, // 请求成功后执行事件
  loadstart: noop, // 接收到响应数据时执行事件
  loadend: noop, // 请求结束时执行事件
  progress: noop, // 请求接收到更多数据时执行事件
  overtime: noop, // 请求超时执行事件
}

// 封装xhr请求
function ajax(o: Options): () => void {
  const options = Object.assign(defaults, o)
  const xhr = new XMLHttpRequest()
  xhr.open(options.type, options.url, options.async)
  // 设置请求头
  for (const key in options.headers) {
    xhr.setRequestHeader(key, options.headers[key])
  }
  // 注册事件
  const events = ['readystatechange', 'abort', 'error', 'load', 'loadstart', 'loadend', 'progress', 'overtime']
  for (const event of events) {
    xhr.addEventListener(event, () => {
      options[event](xhr)
    })
  }
  xhr.send(options.data)

  // 返回一个终止请求的函数
  return function () {
    xhr.abort()
  }
}
// 默认的检测成功请求的函数
const checkSuccess = (xhr: XMLHttpRequest) => (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304
// 自动重发
function autoResend(o: Options, count = 0, isSuccess = checkSuccess) {
  // 通过结束事件检测是否成功
  const preLoadend = o.loadend
  o.loadend = (xhr: XMLHttpRequest) => {
    if (preLoadend) {
      preLoadend(xhr)
    }
    // 错误重发
    if (!isSuccess(xhr) && count > 0) {
      abort = autoResend(o, count - 1, isSuccess)
      count = 0
    }
  }

  let abort: () => void
  abort = ajax(o)
  // 返回一个终止请求的函数
  return () => {
    count = 0 // 数字置0，避免重发
    abort()
  }
}

// 简单的promise封装
function ajaxWithPromise(o: Options) {
  return new Promise((resolve, reject) => {
    o.loadend = (xhr: XMLHttpRequest) => {
      resolve(xhr)
    }
    ajax(o)
  })
}

function autoResendFetch(o) {}

type AjaxNoop = (() => void) | ((xhr: XMLHttpRequest) => void)
interface Options {
  url: string
  type?: string
  async?: boolean
  headers?: { [propName: string]: string }
  timeout?: number
  data?: any
  readystatechange?: AjaxNoop
  abort?: AjaxNoop
  error?: AjaxNoop
  load?: AjaxNoop
  loadstart?: AjaxNoop
  loadend?: AjaxNoop
  progress?: AjaxNoop
  overtime?: AjaxNoop
}
