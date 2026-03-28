# Profilo — Quickstart

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- An [Anthropic API key](https://console.anthropic.com/) (for cover letter generation)

## 1. Clone & configure

```bash
git clone https://github.com/charalii/HireScope.git profilo
cd profilo
cp .env.example .env
```

Open `.env` and add at minimum:
```
ANTHROPIC_API_KEY=sk-ant-...
SECRET_KEY=any-random-string-here
```

## 2. Start the stack

```bash
make dev
```

Wait ~60 seconds for Docker to build images. Then:
- **App** → http://localhost:3000
- **API docs** → http://localhost:8000/docs

## 3. Run migrations

```bash
make migrate
```

## 4. Load real vacancies

```bash
make scrape
```

This triggers all 9 scrapers (EU Careers, NATO, EEAS, EDA, NSPA, EuroBrussels, EUISS, EUSPA, Frontex). Takes ~2-3 minutes.

## 5. Create your account & test

1. Go to http://localhost:3000/signup
2. Upload your CV
3. Click "Run Matching" on the dashboard

## Optional: Enable Stripe payments

1. Create a [Stripe account](https://stripe.com) (free)
2. Create two products: **Pro €19/mo** and **Team €49/mo**
3. Copy the Price IDs into `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_PRICE_PRO=price_...
   STRIPE_PRICE_TEAM=price_...
   ```
4. Install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
   ```bash
   make stripe-listen
   ```

## Common commands

| Command | What it does |
|---------|-------------|
| `make dev` | Start everything |
| `make migrate` | Apply DB schema changes |
| `make scrape` | Reload vacancies from all sources |
| `make logs` | Watch backend logs |
| `make stop` | Stop all containers |
| `make reset` | Wipe DB and start fresh |
