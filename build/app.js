"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const express_session_1 = __importDefault(require("express-session"));
const port = process.env.PORT || 7071;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const sessionMiddleware = (0, express_session_1.default)({
    secret: "changeit",
    resave: true,
    saveUninitialized: true,
});
app.use(sessionMiddleware);
app.get("/", (req, res) => {
    res.sendFile("./index.html", { root: process.cwd() });
});
app.post("/incr", (req, res) => {
    const session = req.session;
    session.count = ((session === null || session === void 0 ? void 0 : session.count) || 0) + 1;
    res.status(200).end("" + (session === null || session === void 0 ? void 0 : session.count));
});
app.post("/logout", (req, res) => {
    const sessionId = req.session.id;
    req.session.destroy(() => {
        io.to(sessionId).disconnectSockets();
        res.status(204).end();
    });
});
const io = new socket_io_1.Server(httpServer, {
    allowRequest: (req, callback) => {
        const fakeRes = {
            getHeader() {
                return [];
            },
            setHeader(key, values) {
                req.cookieHolder = values[0];
            },
            writeHead() { },
        };
        // @ts-ignore
        sessionMiddleware(req, fakeRes, () => {
            if (req.session) {
                fakeRes.writeHead();
                req.session.save();
            }
            callback(null, true);
        });
    },
});
io.engine.on("initial_headers", (headers, req) => {
    if (req.cookieHolder) {
        headers["set-cookie"] = req.cookieHolder;
        delete req.cookieHolder;
    }
});
io.on("connect", (socket) => {
    const req = socket.request;
    socket.join(req.session.id);
    socket.on("incr", (cb) => {
        req.session.reload((err) => {
            if (err) {
                return socket.disconnect();
            }
            req.session.count = (req.session.count || 0) + 1;
            req.session.save(() => {
                cb(req.session.count);
            });
        });
    });
});
httpServer.listen(port, () => {
    console.log(`application is running at: http://localhost:${port}`);
});
// // import express, { Application, Request, Response, NextFunction } from "express";
// // var http = require('http');
// // const app: Application = express();
// // // app.get("/", (req: Request, res: Response, next: NextFunction) => {
// // //   res.send("Hello World!");
// // // });
// // var server = http.createServer(app);
// // const io = require('socket.io')(server)
// // io.on('connection', (socket: any) => {
// //   console.log('有一个客户端连接了服务器：', socket)
// // })
// // server.listen(7071, function () {
// //   console.log("Example app listening on port 7071!");
// // });
// const app = require('http').createServer(function serveIndex (req: any, res: any) {
//   res.write(`
// <html>
// <head>
// <title>微信小游戏</title>
// <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
// </head>
// <body>
// <header>
// <h1>《微信小游戏开发》</h1>
// </header>
// <ul>
//   <li><a href="https://www.haozengrun.com">主页跳转</a></li>
//   <li>游戏专用域名</li>
// </ul>
// <footer>ELEVEN</footer>
// </body>
// </html>
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
