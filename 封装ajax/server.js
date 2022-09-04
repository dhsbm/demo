// node搭个简单的服务器
const http = require('http')
const fs = require('fs')

const server = http.createServer(function (req, res) {
  console.log(req.url)
  switch (req.url) {
    case '/':
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      res.write(fs.readFileSync(`./index.html`, 'utf-8'))
      res.end()
      break
    case '/favicon.ico':
      res.end()
      break
    case '/success':
      setTimeout(() => {
        res.end('success')
      }, 2000)
      break
    case '/fail':
      setTimeout(() => {
        res.statusCode = 400
        res.end('fail')
      }, 1000)
      break
    case '/index.js':
      res.write(fs.readFileSync(`./index.js`, 'utf-8'))
      res.end()
      break
    default:
      res.end()
  }
})

// 第三步，启动服务
server.listen(3000, function () {
  console.log('http://localhost:3000/')
})
