"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/", (req, res, next) => {
    res.send("Hello World!");
});
const io = require('socket.io')(app);
// 有客户端连接服务器
io.on('connection', (socket) => {
    console.log('有一个客户端连接了服务器：', socket);
});
app.listen(7071, function () {
    console.log("Example app listening on port 7071!");
});
