"use client";

import * as React from 'react'
import Image from "next/image";
import {useSearchParams} from 'next/navigation';

export default function chatBot() {

  const textRef = React.useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = React.useState(false)

  const [messages, setMessages] = React.useState<string[]>(['Lets play 20 questions! Would you like to be asker (ask only yes/no questions) or answerer (replying to the yes/no questions)?']);

  const [numDots, setDots] = React.useState(1)

  const searchParams = useSearchParams();

  const embeddedUser = searchParams.get("username")

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

  const postUser = () => {

    fetch("http://localhost:8000/polls/save-user-chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([embeddedUser]),
    }) 

  };

  const getChatHistory = () => {

    fetch("http://localhost:8000/polls/get-chat-history/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([embeddedUser]),
    }) 
    .then(data => {data.json})
    .then(data => {
      console.log(data)
      
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

  React.useEffect(() => {

    getChatHistory() //attempt to get existing chat upon entering chat page

  }, [])

  return (
    <main className="chatMain">
      <div className='chat-title-and-save-div'>
        <h1 className="chat-title">20 Questions</h1>
        <button className='chat-save-button' onClick={postUser}>Save</button>
      </div>

      <div className="chat">
        {messages.map((message, idx) => 

            <div key={idx} className="message" style={{alignSelf: idx % 2 == 0 ? "flex-start" : "flex-end"}}>{message}</div>
          
        )}

        {loading && (<div className="message" style={{alignSelf: "flex-start"}}>{".".repeat(numDots)}</div>)}
        <div style={{alignSelf: "flex-end"}} ref={chatBottom}></div>
      </div>

      <div className="chat-input">
        <textarea ref={textRef} id="input-text" className="input-text" placeholder="Type your message here..." onKeyDown={onEnter}></textarea>
        <button className="input-button" onClick={handleSendMessage}>Enter</button>
      </div>
      
    </main>

  );
}
