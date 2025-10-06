# RealState (Abel Estate)

A simple full-stack real-estate listing application for browsing, searching, creating, updating and deleting property listings. Authentication supports email/password and Google OAuth (client) while the API uses JWT in an HTTP-only cookie for protected routes.

## Intent

The project (branded here as "Abel Estate") is a marketplace for property listings. Typical user flows:

- Users can sign up / sign in (email/password and Google OAuth via Firebase on the client).
- Authenticated users can create, update, and delete their own listings (with images uploaded from the client to Firebase Storage).
- Visitors can browse, search, and filter listings.
- Visitors can contact landlords via links provided on listing pages.

The repository contains a Node.js/Express backend that exposes a REST API and a React (Vite) frontend served either by a dev server or the built `client/dist` static files.

## Tech stack

- Backend: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT)
- Frontend: React, Vite, Tailwind CSS, Firebase (for auth + storage), Redux Toolkit
- Dev tooling: nodemon (for backend dev), Vite (frontend dev/build)

## Repo layout

Key folders/files:

- `api/` - Express API
  - `index.js` - Server entry (serves `client/dist` in production)
  - `controllers/` - route handlers (auth, listing, user)
  - `models/` - Mongoose models for User and Listing
  - `routes/` - API route definitions
  - `utils/` - helpers (DB connect, token verification, error handler)
- `client/` - React + Vite frontend
  - `src/` - React source files (pages, components, firebase config)

## Quick start (development)

1. Clone repository and install root dependencies (from project root):

```bash
# from project root
npm install
```

2. Backend (dev):

```bash
# from project root
npm run dev
```

This will run the backend with nodemon (see package.json scripts).

3. Frontend (dev, in a separate terminal):

```bash
cd client
npm install
npm run dev
```

The client dev server proxies API requests to `/api` (see `client/vite.config.js`).

4. Production build (serve static client from backend):

```bash
# from project root
npm run build
```

This script builds the client into `client/dist` and the backend `api/index.js` is already configured to serve that folder.

## Environment variables

Create a `.env` in the project root with at least:

- `MONGO` — MongoDB connection URI
- `JWT_SECRET_KEY` — secret used to sign JWTs

The client also uses Firebase config found in `client/src/firebase.js`. Optionally you may supply those values as Vite env variables (e.g. `VITE_FIREBASE_API_KEY`) if you prefer.

## API overview

All API URLs are prefixed with `/api` when the server runs at the project root.

Authentication

- POST `/api/auth/signUp` — register with email/password (controller: `api/controllers/auth.controller.js`)
- POST `/api/auth/signIn` — sign in (sets `access_token` cookie)
- POST `/api/auth/google` — called by client after Firebase OAuth to create/return user and set cookie
- POST `/api/auth/signOut` — clears auth cookie

Users

- GET `/api/user/get/:id` — get user details (protected)
- POST `/api/user/update/:id` — update user (protected)
- DELETE `/api/user/delete/:id` — delete user (protected)

Listings

- POST `/api/listing/create` — create a listing (protected)
- GET `/api/listing` — list/search listings (query params supported for filters and pagination)
- GET `/api/listing/get/:id` — get a single listing public view
- GET `/api/listing/:id` — get listings by user (protected)
- PUT `/api/listing/update/:id` — update a listing (protected)
- DELETE `/api/listing/delete/:id` — delete a listing (protected)

Authentication is handled server-side using a JWT stored in an HTTP-only cookie named `access_token`. The middleware `api/utils/verifyToken.js` inspects this cookie to protect routes.

## Notes & assumptions

- The frontend uploads images to Firebase Storage and sends image URLs to the server as part of the listing payload.
- The `api/index.js` file serves `client/dist` for production builds using Express static middleware.
- Error handling uses a shared utility `api/utils/errorHandler.js` and an Express error middleware in `api/index.js`.

## Next steps / optional improvements

- Add `.env.example` with example env keys (I can add this if you want).
- Add README badges (build, license, node version).
- Add quick curl examples for auth and listing flows.
- Add GitHub Actions for linting/tests and a simple deploy pipeline.

---

If you'd like, I can also add a `.env.example` file and inline curl examples for signing up and creating a listing. Tell me which extras you want and I'll add them.
