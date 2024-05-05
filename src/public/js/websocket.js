const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
    console.log("We got a message :", message.data);
})

socket.addEventListener("close", () => {
    console.log("Disconnected from Server");
});

messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    const msg = {
        data: input.value,
    }
    socket.send(JSON.stringify(msg));
    input.value = "";
});