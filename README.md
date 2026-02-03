# Chirper API

> A Twitter-like API for learning webserver fundamentals

## What is Chirper?

Chirper is just imitating the Twitter behaviour

## Features
- Post short messages ("chirps")
- User authentication with JWT
- RESTful API design
- Webhook with pseudo polka

## Tech Stack
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **Database:** Postgres
- **ORM:** Drizzle
- **Testing / tooling:** Boot.dev CLI

## Prerequisites
- Node.js (see `.nvmrc` for recommended version)
- npm or yarn
- SQLite (if needed for local development)
- 
## Quick Start
1. Clone & install
2. Set up environment
3. Initialize database
4. Start server

## Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| DB_URL | Database connection | `postgresql://...` |
| JWT_SECRET | Secret for tokens | `your-secret-key` |
| POLKA_KEY | Secret provvided by webhook offerer | `...` |

## API Endpoints
### Authentication
- POST /api/register
- POST /api/login

### Chirps
- GET /api/chirps
- POST /api/chirps
- DELETE /api/chirps/:id

## Database Schema
src/db/schema.ts

## Testing
auth.test.ts

## Learning Resources
- HTTP & REST Basics
- Authentification & Authorizaation
- Query Parameters
- Database + drizzle ORM (like postgres)
- API Error HAndling
- TS for Backend
  
## Troubleshooting
[Common issues]