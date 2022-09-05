## 介绍
封装ajax算是一道常见的面试题，还附带一个请求错误时的重发功能

核心代码在 `index.js` 中，为了测试功能，使用node搭建了简单的服务器

## 开发及测试
在本文件夹下运行以下代码启动服务器

```
node .\server.js
```

需要热更新的话可以使用 `nodemon`

```
npm i nodemon -g
nodemon .\server.js
```

然后访问网址 `http://localhost:3000/`，即可在浏览器环境下运行 `index.js`

可以选择性解开 `index.js` 文件中的测试代码，查看请求结果

> 在 `index.ts` 中编写了代码的 TS 版本