"use client";

import * as React from 'react'
import Image from "next/image";

export default function chatBot() {

  const textRef = React.useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = React.useState(false)

  const [messages, setMessages] = React.useState<string[]>(['Lets play 20 questions! Would you like to be asker (ask only yes/no questions) or answerer (replying to the yes/no questions)?']);

  const [numDots, setDots] = React.useState(1)

  const chatBottom = React.useRef<null | HTMLDivElement>(null)

  const scrollBottom = () => {
    chatBottom.current?.scrollIntoView({"behavior": 'smooth'})
  }

  React.useEffect(() => {
    scrollBottom()  //scroll bottom when new msg appears
  }, [messages])

  const getResp = async () => {

    setLoading(true)

    const res = await fetch("http://localhost:8000/polls/get-resp/", {
      method: "GET",
    }) 
    const data = await res.json()

    setMessages(prev => [...prev, data.message]); //add ai response to chat history
  
    setLoading(false)
    
  };

  const postMsg = (messages : string[]) => {

    fetch("http://localhost:8000/polls/send-msg/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([messages, messages.length]),
    }) 

  };

  const handleSendMessage = () => {
    
    if (textRef.current && textRef.current.value.trim() != "") {

      const newMessage = textRef.current.value;

      const newMessagesList = [...messages, newMessage];

      setMessages(newMessagesList);
      textRef.current.value = "";

      postMsg(newMessagesList);
      getResp();

    }

  }

  const onEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {

    if (event.key == "Enter" && !event.shiftKey) {
      event.preventDefault(); //disables creation of newline after pressing enter
      handleSendMessage();
    }

  }

  React.useEffect(() => {

    if (!loading) {
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => prev == 3 ? 1 : prev + 1)
    }, 400);

    return () => clearInterval(interval);

  }, [loading]); 

  return (
    <main className="main">
      <h1 className="title">20 Questions</h1>

      <div className="chat">
        {messages.map((message, idx) => 
          <div key={idx}>
            <div className="message" style={{alignSelf: idx % 2 == 0 ? "flex-start" : "flex-end"}}>{message}</div>
          </div>
          
        )}

        {loading && (<div className="message" style={{alignSelf: "flex-start"}}>{".".repeat(numDots)}</div>)}
        <div style={{alignSelf: "flex-end"}} ref={chatBottom}>dummy</div>
      </div>

      <div className="chat-input">
        <textarea ref={textRef} id="input-text" className="input-text" placeholder="Type your message here..." onKeyDown={onEnter}></textarea>
        <button className="input-button" onClick={handleSendMessage}>Enter</button>
      </div>
      
    </main>

  );
}
