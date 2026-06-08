# LuxeCuts — Hair Salon Booking (React Frontend)

A responsive hair salon booking frontend built with React 19, Vite, Redux Toolkit, React Router, Axios, and Tailwind CSS v4.

## Features

- **Authentication** — Login & register with role-based routing (customer / admin)
- **Dashboard** — Upcoming appointments and quick stats
- **Weekly calendar** — Week overview with per-stylist availability heat map
- **Booking flow** — Select date → time slot → seat → service → confirm
- **Available seats** — Real-time seat/slot availability per day
- **Booking history** — View and cancel upcoming appointments
- **Admin dashboard** — Stats, weekly overview, all bookings table

## Tech stack

| Package | Purpose |
|---------|---------|
| React 19 + Vite 8 | UI & build |
| React Router 7 | Routing |
| Redux Toolkit 2 | State management |
| Axios 1 | HTTP client (ready for backend) |
| Tailwind CSS 4 | Styling |

## Quick start

```bash
cd hair-salon-booking
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | jane@example.com | password123 |
| Admin | admin@luxecuts.com | admin123 |

## Project structure

```
src/
├── api/           # Axios instance + auth/booking APIs (mock + backend-ready)
├── components/    # UI, layout, booking widgets
├── pages/         # Login, Register, Dashboard, Book, History, Admin
├── store/         # Redux slices (auth, booking)
└── utils/         # Dates, constants
```

## Backend integration

The app uses **localStorage mock APIs** by default. To connect a Node.js backend:

1. Copy `.env.example` to `.env` and set `VITE_API_URL`
2. Replace mock functions in `src/api/authApi.js` and `src/api/bookingApi.js` with `api.post()`, `api.get()`, etc.

Expected endpoints:

- `POST /auth/login`, `POST /auth/register`
- `GET /bookings/availability?date=YYYY-MM-DD`
- `POST /bookings`, `GET /bookings`, `DELETE /bookings/:id`

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
