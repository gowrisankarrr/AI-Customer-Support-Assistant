import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

function Logs({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/logs");

      const formatted = res.data.flatMap((log) => [
        {
          from: "user",
          text: log.query,
          inputType: log.inputType,
          timestamp: log.timestamp,
        },
        {
          from: "bot",
          text: log.response,
          timestamp: log.timestamp,
        },
      ]);

      setMessages(formatted);
    } catch {
      console.error("Failed to load logs");
    }
  };

  const deleteLogs = async () => {
    if (!window.confirm("Delete all logs?")) return;

    setLoading(true);
    try {
      await axios.delete("http://localhost:8080/admin/logs");
      setMessages([]);
      alert("Logs deleted");
    } catch {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Logs</h2>

        <div className="log-actions">
          <button
            className="logs-btn danger"
            onClick={deleteLogs}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Logs"}
          </button>

          <button className="logs-btn" onClick={onBack}>
            Back
          </button>
        </div>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 ? (
          <p className="empty">No logs available</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message ${msg.from}`}>
              <div className="msg-text"><ReactMarkdown>{msg.text}</ReactMarkdown></div>

              <div className="msg-meta">
                {msg.inputType && <span>{msg.inputType}</span>}
                <span>{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Logs;
