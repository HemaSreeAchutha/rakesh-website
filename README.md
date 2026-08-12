# Rakesh Achutha — Portfolio & Consultation Platform

Personal portfolio, consultation booking, and live classes hub.

## Structure

- `client/` — React (Vite) frontend, Tailwind CSS
- `server/` — Node.js + Express backend, MySQL database

## Setup

### Client
```bash
cd client
npm install
npm run dev
```

### Server
```bash
cd server
npm install
npm run dev
```

Create a `.env` file inside `server/` with:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=rakesh_portfolio
EMAIL_USER=
EMAIL_PASS=
JWT_SECRET=
```

## Features

- Portfolio (About, Experience, Projects, Skills)
- Contact form
- Consultation booking system
- Live classes / webinar hub
- Admin dashboard for managing bookings