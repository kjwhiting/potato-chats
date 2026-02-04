# 🥔 potato-chats

A chatbot specifically designed to tell you **everything** about potatoes.

The goal is to build a basic chat interface that integrats AI to answer questions about potatoes and (eventually) enabling two AIs to chat with each other about their favorite topic—potatos.

A full-stack, AI-powered chat application built to explore LLM integrations and conversational state management. This project serves as a technical demonstration of handling persistent chat sessions and local AI model communication.

## 🚀 Key Features
- **Persistent Conversations:** Powered by Node.js `DatabaseSync` with SQLite to store and retrieve chat history.
- **Stateful AI Handshake:** Implements a RESTful flow using `POST` to initialize sessions and `PUT` to maintain multi-turn context.
- **Clean UI/UX:** Responsive React interface with smooth auto-scrolling, real-time "thinking" states, and "New Conversation" logic.
- **Smart Response Parsing:** Custom logic to clean DeepSeek-style `<think>` tags and navigate nested JSON structures from local LLMs.

## 🏗️ Architecture: Micro-Patterns
To explore modern deployment and scaling strategies, the project is split into two autonomous services:

- **`/client` (Micro-Frontend):** A React-based SPA that manages user state, real-time message streaming, and UI feedback loops.
- **`/server` (Microservice):** A Node.js API that handles conversational logic, AI model handshakes, and SQLite persistence.

This decoupled structure ensures that either service can be updated, tested, or scaled without impacting the other.

## 🛠️ Tech Stack
- **Frontend:** React, TanStack Query (React Query), CSS3
- **Backend:** Node.js, Express
- **Database:** SQLite (Node.js 22+ `node:sqlite`)
- **AI Engine:** LM Studio (OpenAI-compatible API)

## ⚙️ How to Run Locally

The backend and frontend are managed in separate directories. 

### 1. Prerequisites
- **Node.js:** v22.5.0 or higher (required for `node:sqlite`).
- **LM Studio:** Running locally on port `1234`.

### 🖥️ LM Studio Setup (Required)
This project relies on a local inference server to run the AI. Follow these steps to prepare your environment:

1. **Download:** Install [LM Studio](https://lmstudio.ai/) for your OS.
2. **Download a Model:** Search the "Discover" tab for a model (e.g., `Llama 3` or `Mistral`). A 4-bit quantized version is recommended for most consumer hardware.
3. **Start the Server:**
   - Click the **Local Server** icon (↔️) on the left sidebar.
   - Select your model from the dropdown at the top.
   - Click **Start Server**.
4. **Verify Settings:** Ensure the server is running on `http://localhost:1234` and that **CORS** is enabled in the server settings to allow the local backend to communicate with it.

### 2. Installation
Run `npm install` in both the client and server directories:
```bash
# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm run dev
⚙️ How to Run Locally
The project is split into a client/ and server/ architecture.

1. Backend Setup
Bash
cd server
npm install
npm run dev
Note: Ensure your local LLM (LM Studio) is running on port 1234.

2. Frontend Setup
Bash
cd client
npm install
npm run dev
The Vite dev server will proxy requests to the backend on port 5000.

3. Running Tests
The project uses the experimental SQLite features in Node.js.

Bash
$env:NODE_OPTIONS='--experimental-sqlite'; npm run test
💡 Portfolio Note
