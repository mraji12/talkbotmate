import React, { useState } from "react";
import "./App.css";

const MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";

function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async () => {
    const prompt = query.trim();
    if (!prompt) return;
    if (!apiKey) {
      setError("Missing API key. Add VITE_GEMINI_API_KEY to your .env file.");
      return;
    }

    setError("");
    setLoading(true);
    addMessage("user", prompt);
    setQuery("");

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Request failed");
      }

      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response generated.";

      const assistantText = text
        .split("\n")
        .filter((line) => line.trim())
        .map((line, index) => `${index + 1}. ${line.trim()}`)
        .join("\n");

      addMessage("assistant", assistantText);
    } catch (err) {
      console.error("Error generating response:", err);
      setError("Unable to generate a response. Please check your API key and network connection.");
      addMessage("assistant", "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError("");
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>Talkmate Bot</h1>
          <p>Ask the model anything and receive a formatted AI response.</p>
        </div>
      </header>

      <section className="query-container">
        <textarea
          placeholder="Type your message here..."
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          className="query-input"
          rows={4}
        />
        <div className="button-row">
          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={loading || !query.trim()}
          >
            {loading ? "Generating..." : "Send"}
          </button>
          <button onClick={handleClear} className="clear-button">
            Clear
          </button>
        </div>
        <p className="hint-text">Press Ctrl+Enter or ⌘+Enter to submit.</p>
        {error && <div className="error-banner">{error}</div>}
      </section>

      <section className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">Your conversation will appear here.</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message-box ${msg.role === "assistant" ? "assistant" : "user"}`}
            >
              <div className="message-label">{msg.role === "assistant" ? "AI" : "You"}</div>
              <pre>{msg.content}</pre>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;
