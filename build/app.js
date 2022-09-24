"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var http = require('http');
const app = (0, express_1.default)();
// app.get("/", (req: Request, res: Response, next: NextFunction) => {
//   res.send("Hello World!");
// });
var server = http.createServer(app);
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log('有一个客户端连接了服务器：', socket);
});
server.listen(7071, function () {
    console.log("Example app listening on port 7071!");
});
