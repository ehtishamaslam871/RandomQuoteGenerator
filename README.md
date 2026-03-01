# Image Gallery - MERN Stack

A beautiful, responsive grid-based image gallery powered by the Unsplash API, built with the MERN stack.

## Features

- **Search & Filter** — Search millions of high-quality images from Unsplash
- **Responsive CSS Grid** — Adaptive layout that looks great on any screen size
- **Download Button** — Download any image directly to your device
- **Save/Bookmark** — Save favorite images to MongoDB collection
- **Lightbox View** — Full-screen image preview with download option
- **Category Tags** — Quick-filter by popular categories
- **Lazy Loading** — Images load efficiently as you scroll

## Tech Stack

| Layer    | Technology         |
| -------- | ------------------ |
| Frontend | React 18 + Vite    |
| Backend  | Node.js + Express  |
| Database | MongoDB + Mongoose |
| API      | Unsplash API       |
| Styling  | CSS Grid + Flexbox |

## Getting Started

### 1. Get an Unsplash API Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your **Access Key**

### 2. Configure Environment

Edit `server/.env` and replace the placeholder:

```
UNSPLASH_ACCESS_KEY=your_actual_access_key_here
MONGODB_URI=mongodb://localhost:27017/image-gallery
PORT=5000
```

### 3. Install Dependencies

```bash
npm run install-all
```

### 4. Start Development

```bash
npm run dev
```

This starts both the Express server (port 5000) and Vite dev server (port 3000).

Open **http://localhost:3000** in your browser.

> **Note:** MongoDB is optional. The gallery works fully without it — the save/bookmark feature just won't persist.

## Project Structure

```
├── server/
│   ├── index.js              # Express server entry point
│   ├── models/
│   │   └── SavedImage.js     # Mongoose schema for saved images
│   ├── routes/
│   │   ├── images.js         # Unsplash API proxy routes
│   │   └── saved.js          # CRUD for saved/bookmarked images
│   └── .env                  # Environment variables
├── client/
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── index.css         # Complete styling
│   │   ├── main.jsx          # React entry point
│   │   └── components/
│   │       ├── SearchBar.jsx    # Search input with submit
│   │       ├── CategoryTags.jsx # Quick category filters
│   │       ├── ImageGrid.jsx    # CSS Grid gallery container
│   │       ├── ImageCard.jsx    # Individual image card
│   │       ├── Lightbox.jsx     # Full-screen image viewer
│   │       └── Toast.jsx        # Notification component
│   └── vite.config.js        # Vite config with API proxy
└── package.json              # Root scripts (concurrently)
```

## API Endpoints

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| GET    | `/api/images/random`    | Get trending images     |
| GET    | `/api/images/search`    | Search images by query  |
| GET    | `/api/images/download`  | Download image via proxy |
| GET    | `/api/saved`            | Get saved images        |
| POST   | `/api/saved`            | Save/bookmark an image  |
| DELETE | `/api/saved/:unsplashId`| Remove saved image      |
