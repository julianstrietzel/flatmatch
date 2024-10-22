import axios from "axios";
import { io } from "socket.io-client";

const API_URL = "http://localhost:3000/chats";
const SERVER_URL = "http://localhost:3000";
const USER_ID = "6654d84926cfb6b2895ae9a6"; // Replace with the actual user ID you want to test

const socket = io(SERVER_URL);

socket.on("connect", () => {
  console.log("Connected to server");
  socket.emit("subscribeToChats", USER_ID);
});

socket.on("chatUpdated", (chat) => {
  console.log("Chat updated received:", chat);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// call the chat api to create a chat and make a new message
let chatId;
axios
  .post(API_URL, {
    landlord: USER_ID,
    tenant: "6654d84926cfb6b2895ae9a4", // Replace with actual tenant ID if needed
  })
  .then((response) => {
    console.log("Chat created:", response.data);
    chatId = "6657773a57357c730f653d27";
    axios
      .post(`${API_URL}/${chatId}`, {
        content: "Hello, how are you?",
        sender: "tenant",
      })
      .then((response) => {
        console.log("Message sent:", response.data);
      });
  })
  .catch((error) => {
    console.error("Error creating chat:", error);
  });

// Simulate a disconnection after 10 seconds
setTimeout(() => {
  socket.disconnect();
}, 10000);
