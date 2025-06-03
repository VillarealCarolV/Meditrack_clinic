# Meditrack Backend

A simple Node.js/Express backend with JWT authentication for the Meditrack Clinic EMR frontend.

## Features
- Express API server
- JWT-based authentication
- Example users for Patient, Staff, Owner
- Protected `/api/auth/me` endpoint

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Use the following demo users to login:
   - **patient@demo.com** / `password`
   - **staff@demo.com** / `password`
   - **owner@demo.com** / `password`

## Endpoints
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/auth/me` — Get current user (requires JWT in `Authorization` header)
