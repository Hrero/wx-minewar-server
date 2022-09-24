import express, { Application, Request, Response, NextFunction } from "express";

var http = require('http');

const app: Application = express();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello World!");
});

var server = http.createServer(app);

const io = require('socket.io')(server)

io.on('connection', (socket: any) => {
  console.log('有一个客户端连接了服务器：', socket)
})

server.listen(7071, function () {
  console.log("Example app listening on port 7071!");
});
