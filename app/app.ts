import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";

const port = process.env.PORT || 7071;

const app = express();
const httpServer = createServer(app);

const sessionMiddleware = session({
  secret: "changeit",
  resave: true,
  saveUninitialized: true,
});

app.use(sessionMiddleware);

app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: process.cwd() });
});

app.post("/incr", (req, res) => {
  const session: any = req.session;
  session.count = (session?.count || 0) + 1;
  res.status(200).end("" + session?.count);
});

app.post("/logout", (req, res) => {
  const sessionId = req.session.id;
  req.session.destroy(() => {
    io.to(sessionId).disconnectSockets();
    res.status(204).end();
  });
});

const io = new Server(httpServer, {
  allowRequest: (req: any, callback) => {
    const fakeRes = {
      getHeader() {
        return [];
      },
      setHeader(key: any, values: any) {
        req.cookieHolder = values[0];
      },
      writeHead() {},
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

io.engine.on("initial_headers", (headers: { [x: string]: any; }, req: { cookieHolder: any; }) => {
  if (req.cookieHolder) {
    headers["set-cookie"] = req.cookieHolder;
    delete req.cookieHolder;
  }
});

io.on("connect", (socket) => {
  const req: any = socket.request;

  socket.join(req.session.id);

  socket.on("incr", (cb) => {
    req.session.reload((err: any) => {
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
