import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// 👇 Replace with your actual API URL
const API_URL = "http://127.0.0.1:5000/chat/";


const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    console.log(newMessages)

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: "cors",
        body: JSON.stringify({
          "question": trimmed,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      const assistantText = data.response

      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
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

  return (
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
  );
};

export default Chat;
