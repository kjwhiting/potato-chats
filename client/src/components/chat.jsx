import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import './chat.styles.css';

const Chat = () => {
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseLlmStudioResponse = (data) => {
    try {
      const rawContent = data.msg.choices[0].message.content;
      return rawContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    } catch (e) {
      console.error("Parsing error:", e, data);
      return "The potato expert encountered a logic error. Please try again!";
    }
  };

  const handleResponse = async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error: ${response.status}`);
    }
    return response.json();
  };

  // Mutation to Start/Reset Chat
  const startChatMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/message', { method: 'POST' });
      return handleResponse(response);
    },
    onSuccess: (data) => {
      setChatId(data.id);
      const cleanMsg = parseLlmStudioResponse(data);
      setMessages([{ role: 'bot', content: cleanMsg }]);
      setErrorMessage(null);
    },
    onError: (err) => setErrorMessage(`Failed to start new session: ${err.message}`),
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ id, text }) => {
      const response = await fetch(`/message/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      return handleResponse(response);
    },
    onSuccess: (data) => {
      const cleanMsg = parseLlmStudioResponse(data);
      setMessages((prev) => [...prev, { role: 'bot', content: cleanMsg }]);
    },
    onError: (err) => setErrorMessage(`Failed to send: ${err.message}`),
  });

  // Initial load
  useEffect(() => {
    startChatMutation.mutate();
  }, []);

  // Handler for the New Conversation button
  const handleNewChat = () => {
    setChatId(null);
    setMessages([]);
    setInput('');
    startChatMutation.mutate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');

    if (chatId) {
      sendMessageMutation.mutate({ id: chatId, text });
    } else {
      setErrorMessage("No active session. Starting one now...");
      startChatMutation.mutate();
    }
  };

  return (
    <div className="chat-container">
      {/* New Header for Actions */}
      <div className="chat-header">
        <span className="session-info">
          {chatId ? `Session: ${chatId}` : 'Connecting...'}
        </span>
        <button 
          className="new-chat-btn" 
          onClick={handleNewChat}
          disabled={startChatMutation.isPending}
        >
          {startChatMutation.isPending ? 'Starting...' : 'New Conversation'}
        </button>
      </div>

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <p>{msg.content}</p>
          </div>
        ))}
        
        {sendMessageMutation.isPending && (
          <div className="message bot typing">Thinking...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about potatoes..."
          autoFocus
        />
        <button type="submit" disabled={sendMessageMutation.isPending || !input.trim() || !chatId}>
          {sendMessageMutation.isPending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;