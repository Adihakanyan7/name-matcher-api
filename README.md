# 🧠 Name Matcher API + React UI

This project is a full-stack solution that:
- Accepts a **text body** and a **list of names**
- Searches for each name in the text
- Returns the **line and character positions** of each match
- Implements this using **multi-threaded workers** in Node.js
- Has a modern React UI that supports multiple input modes

---

## 🖥️ Features

### 🔧 Backend (Node.js + Express)
- Route: `POST /match-names`
- Accepts JSON:
```json
{
  "text": "string",
  "names": ["James", "John"]
}
```
- Splits large text into chunks
- Uses `node:worker_threads` to parallelize name matching
- Aggregates and returns results in the form:
```json
{
  "James": [ { lineOffset, charOffset }, ... ],
  "John": [ { lineOffset, charOffset }, ... ]
}
```

### 💡 Frontend (React + Vite)
- Text input via:
  - Manual text area
  - File upload (`.txt`)
  - URL (e.g., `big.txt`)
- Names input as comma-separated string
- Result section:
  - Shows names with count of matches
  - **Each name is expandable/collapsible**
    - When open, shows line + character offset of each match
- Built with `useState` and controlled components

---

## 🚀 Run the project

### 1. Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure
```
name-matcher-api/
├── backend/
│   ├── server.mjs
│   ├── routes/
│   │   └── matchNamesRoute.mjs
│   ├── services/
│   │   ├── chunkTextService.mjs
│   │   └── aggregatorService.mjs
│   ├── workers/
│   │   └── matcherWorker.mjs
│   └── models/
│       └── matchResult.mjs
│
├── frontend/
│   ├── public/big.txt
│   └── src/App.jsx
```

---

## 🧪 Example Payload
```json
{
  "text": "James went to the store.\nThen John followed James.\nMichael did not go.\nJames was tired.",
  "names": ["James", "John", "Michael"]
}
```

---

## ✨ Future Ideas
- Pagination for results
- Case-insensitive / fuzzy matching
- Download result as CSV
- Search history in browser

---

Built with ❤️ by Adi
