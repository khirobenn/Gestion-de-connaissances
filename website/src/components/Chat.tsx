import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import { supabase } from "../utils/supabase";
import { Sidebar, type Discussion } from "./Sidebar";
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
  const [userDiscussions, setUserDiscussions] = useState<Discussion[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const getUserData = async() =>{
      const { data: { user }} =  await supabase.auth.getUser();
      if(user){
        setUserData(user);
      }

      const { data: discussions } = await supabase
      .from('discussions')
      .select('id, title')

      if(discussions){
        setUserDiscussions([...userDiscussions, ...discussions])
        console.log(discussions)
      }

    }
    getUserData()
  }, [])

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
    await onNewDiscussion();
    const {error:err} = await supabase.auth.signOut()
    if(!err){
      setAccess(false)
    }
  };

  const onNewDiscussion = async () => {
    if(messages.length == 0) return;
    if(!userData) return;
    const newData = { user_id: userData.id, discussion: messages, title:"khiro" }
    const {data: data} = await supabase.from("discussions").insert(
      [
        newData,
      ]
    ).select()

    if(data){
      setMessages([]);
    }
  };

  const onDelete = async(id:string) =>{
    const {error} = await supabase.from("discussions").delete().eq('id', id)
    if(!error){
      const newPreviousDiscussion = userDiscussions.filter(
        discussion => discussion.id != id
      );
      setUserDiscussions(newPreviousDiscussion)
    }
    else{
      console.log("Erreur de supression !")
    }
  }

  const onSelect = async (id:string) => {
    setActiveId(id);
    const { data: data } = await supabase
    .from('discussions')
    .select('discussion')
    .eq('id', id);

    if(data){
      setMessages(data[0].discussion)
    }else{
      console.log("erreur de charger la discussion")
    }
  };

  return (
    <div className="app-layout">
      <Sidebar                          // ← NEW sidebar
        discussions={userDiscussions}
        activeId={activeId}
        onSelect={onSelect}
        onNew={onNewDiscussion}
        onDelete={onDelete}
        onLogout={onLogout}
      />
      <div className="chat-shell">
        <header className="chat-header">
          <div className="chat-header__dot" />
          <span className="chat-header__title">Champions League Assistant</span>
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
    </div>
  );
};

export default Chat;
