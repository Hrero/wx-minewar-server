import express, { Application, Request, Response, NextFunction } from "express";

const app: Application = express();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello World!");
});

const io = require('socket.io')(app)

// 有客户端连接服务器
io.on('connection', (socket: any) => {
  console.log('有一个客户端连接了服务器：', socket)
})

app.listen(7071, function () {
  console.log("Example app listening on port 7071!");
});
