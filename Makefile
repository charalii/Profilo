.PHONY: dev migrate scrape check-scrapers stripe-listen logs stop reset

dev:
	docker compose up --build

migrate:
	docker compose exec backend alembic upgrade head

scrape:
	docker compose exec backend python -m backend.tasks.scrape_tasks

check-scrapers:
	docker compose exec backend python -m backend.scripts.check_scrapers

stripe-listen:
	stripe listen --forward-to localhost:8000/api/billing/webhook

logs:
	docker compose logs -f

stop:
	docker compose down

reset:
	docker compose down -v
