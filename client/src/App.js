import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("https://real-time-chat-aolu.onrender.com");


function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  const chatEndRef = useRef(null);

  // ask username once
  useEffect(() => {
    const name = prompt("Enter your name:");
    setUsername(name || "User");
  }, []);

  // listen messages
  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chatMessage");
  }, []);

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("chatMessage", {
      text: message,
      senderId: socket.id,
      senderName: username,
      time: new Date().toLocaleTimeString(),
    });

    setMessage("");
  };

  return (
    <div className="app">
      <div className="header">Real-Time Chat</div>

      <div className="chat-box">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === socket.id;

          return (
            <div
              key={index}
              className={`message ${isMe ? "right" : "left"}`}
            >
              {!isMe && (
                <span className="username">{msg.senderName}</span>
              )}
              <p>{msg.text}</p>
              <span className="time">{msg.time}</span>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="input-box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
