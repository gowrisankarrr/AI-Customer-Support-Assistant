import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import ReactMarkdown from 'react-markdown';

function Chat({ onShowLogs }) {
  const [messages, setMessages] = useState([]);
  const [inputType, setInputType] = useState("text");
  const chatBoxRef = useRef(null);

  const [query, setQuery] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startVoice = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Voice input not supported in this browser. Use Chrome.");
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: "en-US" });
    setInputType("voice");
  };

  const sendMessage = async () => {
    const finalQuery = query || transcript;
    if (!finalQuery.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: finalQuery, inputType }]);

    try {
      const res = await axios.post("http://localhost:8080/chat", {
        query: finalQuery,
        inputType
      });

      setMessages((prev) => [...prev, { from: "bot", text: res.data.response }]);
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Server error" }]);
    }

    setQuery("");
    resetTranscript();
    setInputType("text");
  };

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Customer Support Assistant</h2>
        <button className="logs-btn" onClick={onShowLogs}>Logs</button>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.from}`}>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={query || transcript}
          onChange={(e) => {
            setQuery(e.target.value);
            setInputType("text");
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask your question..."
        />

        <button className="icon-btn send" onClick={sendMessage}>
          <FaPaperPlane color="white" />
        </button>

        <button className="icon-btn" onClick={startVoice}>
          <FaMicrophone color={listening ? "red" : "black"} />
        </button>
      </div>
    </div>
  );
}

export default Chat;
