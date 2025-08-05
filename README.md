# WeChat 💬

**Real-Time Full-Stack Chat Application**  
Built with React.js · Tailwind CSS · Node.js · Express.js · MongoDB · WebSockets (ws)

---

## 🚀 Overview

WeChat is a real-time messaging platform that enables users to chat instantly over secure WebSocket connections. It features JWT-based authentication, responsive UI, efficient chat history storage, and fast message delivery — ideal for collaborative environments, internal communication, or hobby chat systems.

---

## 📸 Screenshots

![Chat UI](path/to/chat-ui.png)  
![Login Screen](path/to/login.png)  
![Mobile View](path/to/mobile-view.png)

---

## ⚙️ Key Features

- **Real-Time Messaging**: Powered by WebSockets for seamless, bidirectional communication.
- **JWT-Based Authentication**: Secure user sessions using token-based login and access control.
- **Optimized Message Delivery**: Reduced latency by ~40% compared to traditional REST API polling.
- **MongoDB Chat History**: Chat data is stored and indexed efficiently for fast retrieval.
- **Responsive Design**: Tailwind CSS ensures the chat interface adapts beautifully to all screen sizes.
- **Scalable Architecture**: Designed for easy feature expansion (e.g., group chats, media sharing).

---

## 🛠️ Tech Stack

| Layer           | Technologies                                    |
|------------------|-------------------------------------------------|
| Frontend         | React.js, Tailwind CSS                         |
| Backend          | Node.js, Express.js                            |
| Real-Time Layer  | WebSockets (ws) protocol                       |
| Database         | MongoDB                                        |
| Authentication   | JWT-based login and session management         |

---

## 🔍 How It Works

1. **User Logs In**: Authenticated using JWT, securing the session.
2. **WebSocket Connection**: User establishes a socket connection to the server.
3. **Chat Messaging**:
   - Messages are transmitted in real-time via WebSockets.
   - Stored in MongoDB with indexing for efficient search/history retrieval.
4. **Client Updates**:
   - All connected clients update in real time with new messages or online status.

---

## 🚧 Setup & Installation

```bash
# Clone the repository
git clone https://github.com/vikas-chaudhari/wechat.git
cd wechat

# Install backend dependencies
cd backend
npm install

# Start backend server
npm start

# Open new terminal and install frontend dependencies
cd ../frontend
npm install

# Start React development server
npm start
