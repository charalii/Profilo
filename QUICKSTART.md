# Profilo — Quick Start

## Prerequisites
- Docker Desktop installed and running
- Stripe CLI (for billing): `brew install stripe/stripe-cli/stripe`

## 1. Clone and configure
```bash
git clone https://github.com/charalii/Profilo.git
cd Profilo
cp .env.example .env
# Edit .env and fill in: OPENAI_API_KEY, STRIPE_SECRET_KEY, etc.
```

## 2. Start everything
```bash
make dev
```
This starts: FastAPI backend (port 8000), Next.js frontend (port 3000), PostgreSQL, Redis, Celery.

## 3. Run migrations
```bash
make migrate
```

## 4. (Optional) Listen for Stripe webhooks locally
```bash
make stripe-listen
```
Copy the webhook signing secret it prints into `.env` as `STRIPE_WEBHOOK_SECRET`.

## 5. Open the app
- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs
- Dev login (no password): http://localhost:3000/dev

## Useful commands
| Command | What it does |
|---|---|
| `make dev` | Start all services |
| `make migrate` | Run DB migrations |
| `make scrape` | Scrape new vacancies |
| `make logs` | Tail all logs |
| `make stop` | Stop all services |
| `make reset` | Stop + wipe DB volumes |
