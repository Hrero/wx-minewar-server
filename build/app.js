"use strict";
// import express, { Application, Request, Response, NextFunction } from "express";
// var http = require('http');
// const app: Application = express();
// // app.get("/", (req: Request, res: Response, next: NextFunction) => {
// //   res.send("Hello World!");
// // });
// var server = http.createServer(app);
// const io = require('socket.io')(server)
// io.on('connection', (socket: any) => {
//   console.log('有一个客户端连接了服务器：', socket)
// })
// server.listen(7071, function () {
//   console.log("Example app listening on port 7071!");
// });
function serveIndex(req, res) {
    res.write(`
    <html>
    <head>
    <title>微信小游戏</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    </head>
    <body>
    <header>
    <h1>《微信小游戏开发》</h1>
    </header>
    <ul>
      <li><a href="https://www.haozengrun.com">主页跳转</a></li>
      <li>游戏专用域名</li>
    </ul>

    <footer>ELEVEN</footer>
    </body>
    </html>
  `);
    res.end();
}
const app = require('http').createServer(serveIndex);
// 创建 socket.io 服务
const io = require('socket.io')(app);
// 监听 https 端口
app.listen(7071);
// 有客户端连接服务器
io.on('connection', function (socket) {
    console.log('有一个客户端连接了服务器：', socket);
    // socket 代表该客户端的 socket.io 连接
});
