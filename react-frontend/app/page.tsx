"use client";

import * as React from 'react'
import Image from "next/image";

export default function Home() {

  const textRef = React.useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = React.useState<string[]>(['Lets play 20 questions! Would you like to be guesser or answerer?']);

  const getResp = () => {

    fetch("http://localhost:8000/polls/get-resp/", {
      method: "GET",
    }) 
      .then(res => res.json())
      .then((data) => {
        setMessages(prev => [...prev, data.message]); //add ai response to chat history
    })
  
  };

  const postMsg = (msg: string) => {

    fetch("http://localhost:8000/polls/send-msg/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(msg),
    }) 

  };

  const handleSendMessage = () => {
    
    if (textRef.current && textRef.current.value.trim() != "") {
      const newMessage = textRef.current.value;
      setMessages(prev => [...prev, newMessage]);
      textRef.current.value = "";

      postMsg(newMessage)
      getResp()
    }

  }

  const onEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key == "Enter" && !event.shiftKey) {
      event.preventDefault(); //disables creation of newline after pressing enter
      handleSendMessage();
    }
  }

  return (
    <main className="main">
      <h1 className="title">20 Questions</h1>

      <div className="chat">
        {messages.map((message, idx) => 
          <div className="message" key={idx} style={{alignSelf: idx % 2 == 0 ? "flex-start" : "flex-end"}}>{message}</div>
        )}
      </div>

      <div className="chat-input">
        <textarea ref={textRef} id="input-text" className="input-text" placeholder="Type your message here..." onKeyDown={onEnter}></textarea>
        <button className="input-button" onClick={handleSendMessage}>Enter</button>
      </div>
      
    </main>

  );
}
