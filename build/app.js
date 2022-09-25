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
// const app = require('http').createServer(function serveIndex (req: any, res: any) {
//   res.write(`
//     <html>
//     <head>
//     <title>微信小游戏</title>
//     <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
//     </head>
//     <body>
//     <header>
//     <h1>《微信小游戏开发》</h1>
//     </header>
//     <ul>
//       <li><a href="https://www.haozengrun.com">主页跳转</a></li>
//       <li>游戏专用域名</li>
//     </ul>
//     <footer>ELEVEN</footer>
//     </body>
//     </html>
//   `)
//   res.end()
// })
// // 创建 socket.io 服务
// const io = require('socket.io')(app)
// // 监听 https 端口
// app.listen(7071)
// // 有客户端连接服务器
// io.on('connection', function (socket: any) {
//   console.log('有一个客户端连接了服务器：', socket)
//   // socket 代表该客户端的 socket.io 连接
// })
const http = require('http');
const WebS = require('ws');
const fs = require('fs');
const buffer = require('buffer');
//创建服务器
const server = require("http").createServer(function serveIndex(req, res) {
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
});
//使用websocket
const ws = new WebS.Server({ server });
ws.on("connection", (ws) => {
    console.log("已连接客户端");
    //发送消息给客户端
    ws.send("hello client!");
    //监听客户端发来的消息
    ws.on("message", e => {
        //接收到的是一个buffer类型的数据，如<Buffer 68 65 6c 6c 6f 20 73 65 72 76 65 72>
        console.log(e);
        console.log(e.toString()); //将buffer转为字符串
    });
});
//添加监听
server.listen(7071, () => {
    console.log("localhost:7071");
});
