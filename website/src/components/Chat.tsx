import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function Chat ({setAccess} : {setAccess:any}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    let previous_discussion = ""
    for (const mes of messages.slice(-10)){
      previous_discussion += mes["role"] + " : " + mes["content"] + "\n"
    }

    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const previous = newMessages
    try {
      const API_URL = "http://127.0.0.1:5000/stream/";
      let assistantText = ""
      fetch(API_URL, {
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              mode: "cors",
              body: JSON.stringify({
                "question": trimmed,
                "previous_discussion": previous_discussion
              }),
            }).then(response => {
              const reader = response.body?.getReader();
              const decoder = new TextDecoder();

              function read() {
                  reader?.read().then(({ done, value }) => {
                  if (done) {
                      return;
                  }

                  const chunk = decoder.decode(value, { stream: true });
                  assistantText += chunk;
                  setMessages([...previous, { role: "assistant", content: assistantText }]);

                  read();
                  });
              }
              read();
    });
    // setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);

    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const onLogout = async () => {
    const {error:err} = await supabase.auth.signOut()
    if(!err){
      setAccess(false)
    }
  };

  const onNewDiscussion = async () => {
    const { data: { user }} =  await supabase.auth.getUser();

    if(!user) return;
    const newData = { user_id: user.id, discussion: messages }
    console.log(newData)
    const {data: data, error: err} = await supabase.from("discussions").insert(
      [
        newData,
      ]
    ).select()


    if(data){
      setMessages([]);
    }
    else{
      console.log("erreur d'insérer une discussion")
    }

    console.log("data:", data);
    console.log("error:", err);
  };

  return (
    <div className="chat-shell">
      <header className="chat-header">
        <div className="chat-header__dot" />
        <span className="chat-header__title">Champions League Assistant</span>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
          <button className="chat-header-btn chat-header-btn--new" onClick={onNewDiscussion}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1v11M1 6.5h11" stroke="#c8a96e" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            New chat
          </button>
          <button className="chat-header-btn chat-header-btn--logout" onClick={onLogout}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M5 2H2.5A1 1 0 001.5 3v7a1 1 0 001 1H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M8.5 9.5L11.5 6.5 8.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="4.5" y1="6.5" x2="11" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Log out
          </button>
        </div>
      </header>

      <main className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>Start a conversation below ↓</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble chat-bubble--${msg.role}`}>
            <span className="chat-bubble__label">
              {msg.role === "user" ? "You" : "Assistant"}
            </span>
            <p className="chat-bubble__text">{msg.content}</p>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble chat-bubble--assistant">
            <span className="chat-bubble__label">Assistant</span>
            <span className="chat-typing">
              <span /><span /><span />
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      <footer className="chat-input-area">
        <textarea
          className="chat-input"
          rows={1}
          placeholder="Message Assistant.. (Enter to send, Shift+Enter for newline)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="chat-send"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          ↑
        </button>
      </footer>
    </div>
  );
};

export default Chat;
