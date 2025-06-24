# Name Matcher

A simple web application that allows users to input a block of text (manually, via URL, or file upload) and a comma-separated list of names, then finds and highlights all occurrences of those names in the text.

## Features

* **Manual Input**: Paste or type text directly in the browser.
* **URL Input**: Fetch and parse text from any publicly accessible URL.
* **File Upload**: Upload a local text file (TXT, PDF) and extract text.
* **Results**: Display each name with the number of matches and clickable details.

## Tech Stack

* **Frontend**: Vite + React
* **Backend**: Node.js (Express)
* **Hosting**:

  * Frontend on Netlify
  * Backend API on Railway

## URLs

* Frontend: `https://zingy-starburst-8a517b.netlify.app/`
* Backend API: `https://name-matcher-api-production.up.railway.app`

## Local Setup

### Prerequisites

* Node.js >= 16
* npm

### Clone and Install

```bash
# Clone repo
git clone https://github.com/Adihakanyan7/name-matcher-api.git
cd name-matcher-api

# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../frontend
npm install
```

### Environment

Currently no `.env` required for local dev. API base is set to `http://localhost:3000` in `frontend/src/App.jsx`.

### Run Locally

```bash
# Start backend (port 3000)
cd backend
npm start

# In another terminal, start frontend (port 5173 by default)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

### Backend (Railway)

1. Push to GitHub (`master` branch).
2. Railway will auto-build & deploy.
3. Confirm service is **Active** on Railway dashboard.

### Frontend (Netlify)

1. Push frontend changes to `master`.
2. Netlify auto-builds from `frontend` folder.
3. Confirm deployment is **Published** on Netlify dashboard.

## Contributing

Feel free to open issues or pull requests. Use the `main` / `master` branch for stable code.

## License

MIT © Adi Hakanyan
