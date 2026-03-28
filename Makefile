# Profilo — Developer Makefile
# Usage: make dev | make scrape | make logs | make reset

.PHONY: dev stop logs scrape migrate reset help

# ── Start full stack ──────────────────────────────────────────────────────────
dev:
	@echo "🚀  Starting Profilo stack (DB + Redis + Backend + Frontend)…"
	@cp -n .env.example .env 2>/dev/null || true
	docker compose up --build -d db redis
	@echo "⏳  Waiting for Postgres to be ready…"
	@sleep 4
	docker compose up --build -d backend celery-worker celery-beat frontend
	@echo ""
	@echo "✅  Stack is up!"
	@echo "   Frontend  →  http://localhost:3000"
	@echo "   API docs  →  http://localhost:8000/docs"
	@echo ""
	@echo "👉  Next: run 'make migrate' then 'make scrape' to load real data."

# ── Run DB migrations ─────────────────────────────────────────────────────────
migrate:
	@echo "🗄  Running Alembic migrations…"
	docker compose exec backend alembic upgrade head
	@echo "✅  Migrations done."

# ── Trigger scrapers (loads real vacancies) ───────────────────────────────────
scrape:
	@echo "🔍  Triggering all scrapers…"
	docker compose exec backend python -m backend.tasks.scrape_tasks
	@echo "✅  Scraping complete. Refresh the dashboard."

# ── Stripe webhook local tunnel (requires stripe CLI) ────────────────────────
stripe-listen:
	@echo "💳  Forwarding Stripe webhooks to localhost:8000…"
	stripe listen --forward-to localhost:8000/api/billing/webhook

# ── Tail logs ─────────────────────────────────────────────────────────────────
logs:
	docker compose logs -f backend celery-worker

logs-all:
	docker compose logs -f

# ── Stop everything ───────────────────────────────────────────────────────────
stop:
	docker compose down

# ── Full reset (wipes DB volume) ──────────────────────────────────────────────
reset:
	@echo "⚠️   This will delete all data. Press Ctrl+C to cancel, Enter to continue."
	@read _
	docker compose down -v
	@echo "🗑  Volume removed. Run 'make dev' to start fresh."

# ── Help ──────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  make dev          Start full stack (first time setup)"
	@echo "  make migrate      Run DB migrations"
	@echo "  make scrape       Load real vacancies from all sources"
	@echo "  make stripe-listen  Forward Stripe webhooks (needs Stripe CLI)"
	@echo "  make logs         Tail backend logs"
	@echo "  make stop         Stop all containers"
	@echo "  make reset        Wipe everything and start fresh"
	@echo ""
