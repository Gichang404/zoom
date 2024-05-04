import http from "http";
import WebSocket from "ws";
import express from "express";
const app = express();
const path = require("path");

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const sockets = [];

wss.on("connection", (socket) => {
    console.log("Connected to Browser");
    sockets.push(socket);
    socket.on("close", () => {
        console.log("Disconneted from Browser");
    });
    
    socket.on("message", (event) => {
        const data = JSON.parse(event);
        console.log(data.data);
        sockets.forEach(aSocket => aSocket.send(data.data));
    })
});


const handleListen = () => console.log("Listen on http://localhost:3000");
server.listen(3000, handleListen)