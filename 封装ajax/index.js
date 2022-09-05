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

// 封装xhr请求，参数说明见defaults对象
function ajax(url, options) {
  const config = Object.assign({}, defaults, options)
  const xhr = new XMLHttpRequest()
  xhr.open(config.type, url, config.async)
  xhr.timeout = config.timeout
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
const checkSuccess = (res) => (res.status >= 200 && res.status < 300) || res.status === 304
// 自动重发
function autoResend(url, options = {}, count = 0, isSuccess = checkSuccess) {
  // 通过结束事件检测是否成功，默认依照状态码判断
  const preLoadend = options.loadend
  options.loadend = (xhr) => {
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
function ajaxWithPromise(url, options = {}) {
  return new Promise((resolve, reject) => {
    options.loadend = (xhr) => {
      resolve(xhr)
    }
    ajax(url, options)
  })
}

// 封装fetch重发功能
function autoResendFetch(url, config, count = 0, isSuccess = checkSuccess) {
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

// 以下是测试代码

// 测试ajax事件功能
const test1 = (path, port = '3000') => {
  return ajax('http://localhost:' + port + path, {
    load(xhr) {
      console.log(path + '请求完成，状态码为：' + xhr.status)
    },
    error(xhr) {
      console.log(path + '请求失败，状态码为：' + xhr.status)
    },
    loadend(xhr) {
      console.log(path + '请求结束，状态码为：' + xhr.status)
    },
  })
}

false && test1('/success') // 测试正常请求 状态码为200
false && test1('/fail') // 测试失败请求 状态码为400 不触发error
false && test1('/cross', '3001') // 测试跨域请求 状态码为0 触发error

// 测试请求重发功能
const test2 = (path, port = '3000', count = 3) => {
  return autoResend(
    'http://localhost:' + port + path,
    {
      load(xhr) {
        console.log(path + '请求完成，状态码为：' + xhr.status)
      },
      error(xhr) {
        console.log(path + '请求失败，状态码为：' + xhr.status)
      },
      loadend(xhr) {
        console.log(path + '请求结束，状态码为：' + xhr.status)
      },
    },
    count
  )
}

false && test2('/success') // 测试成功请求 无重发
false && test2('/fail') // 测试失败请求 3次重发 时间稳定
false && test2('/cross', '3001') // 测试跨域请求 3次重发 时间不稳定

// 测试中断功能
const abort1 = () => setTimeout(test1('/success'), 1500)
const abort2 = () => setTimeout(test2('/fail'), 2500)
const abort3 = () => setTimeout(test2('/cross', '3001'), 3000)
false && abort1() // 测试成功请求 仅触发loadend 状态码为0
false && abort2() // 测试失败请求 请求仅重发2次，且第2次重发被打断
false && abort3() // 测试跨域请求 请求仅重发2次，且第2次重发被打断

// 测试promise
const test3 = (path, port = '3000') => {
  return ajaxWithPromise('http://localhost:' + port + path)
    .then((xhr) => {
      console.log(xhr)
    })
    .catch((err) => console.log(err))
}
false && test3('/success') // 测试正常请求 状态码为200
false && test3('/fail') // 测试失败请求 状态码为400
false && test3('/cross', '3001') // 测试跨域请求 状态码为0

// 测试重发fetch
const test4 = (path, port = '3000', count = 3) => {
  autoResendFetch('http://localhost:' + port + path, {}, count)
    .then((response) => {
      console.log(response)
      return response.text()
    })
    .then((data) => {
      console.log(data)
    })
    .catch((err) => {
      console.log(err)
    })
}
true && test4('/success') // 测试成功fetch请求 无重发
false && test4('/fail') // 测试失败fetch请求 3次重发
false && test4('/cross', '3001') // 测试跨域fetch请求 3次重发 显示错误信息
