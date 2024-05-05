const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
let roomName = "";
room.hidden = true;

const addMessage = (message) => {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = message;
    ul.appendChild(li);
}

const handleMsgSubmit = (e) => {
    e.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

const handleNameSubmit = (e) => {
    e.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value;
    socket.emit("nickname", value);
    input.value = "";
}

const showRoom = () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMsgSubmit);
    nameForm.addEventListener("submit", handleNameSubmit);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
});

socket.on("welcome", (nickname) => {
    addMessage(`${nickname}님이 참여하셨습니다.`);
});

socket.on("bye", (nickname) => {
    addMessage(`${nickname}님이 퇴장하셨습니다.`);
});

socket.on("new_message", (msg, nickname) => {
    addMessage(`${nickname}: ${msg}`);
})

socket.on("room_change", console.log);