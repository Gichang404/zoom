import http from "http";
// import WebSocket from "ws";
import express from "express";
import SocketIO from "socket.io";

const app = express();
const path = require("path");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = new SocketIO.Server(httpServer);

const publicRooms = () => {
    const { sids, rooms } = wsServer.sockets.adapter;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    })
    return publicRooms;
}

const countRoom = (roomName) => {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon"
    socket.onAny((event) => {
        console.log(`Socket Event :: ${event}`);
    });

    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket["nickname"], countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });

    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    })

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg, socket["nickname"]);
        done();
    })

    socket.on("disconnecting", () => {
        console.log(socket.rooms);
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket["nickname"], countRoom(room) - 1));
    });

    socket.on("nickname", (nickname) => socket["nickname"] = nickname);
});

// const wss = new WebSocket.Server({server});
// const sockets = [];
// wss.on("connection", (socket) => {
//     console.log("Connected to Browser");
//     sockets.push(socket);
//     socket.on("close", () => {
//         console.log("Disconneted from Browser");
//     });
    
//     socket.on("message", (event) => {
//         const data = JSON.parse(event);
//         console.log(data.data);
//         sockets.forEach(aSocket => aSocket.send(data.data));
//     })
// });


const handleListen = () => console.log("Listen on http://localhost:3000");
httpServer.listen(3000, handleListen)