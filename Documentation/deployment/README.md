# Deployment Guide (Hetzner + Docker + Traefik)

This document explains how we self-host this project on a Hetzner server using Docker Compose and Traefik.

## Overview

The application is split into two containers:

- `frontend` (React/Vite build served by Nginx)
- `backend` (Spring Boot API with SQLite persistence)

Traefik runs as a reverse proxy and handles:

- HTTPS certificates (Let's Encrypt)
- routing by host/path
- forwarding browser requests to the correct container

Both Traefik and this app stack connect to the same external Docker network: `app-network`.

## Architecture

- Browser requests `https://<domain>`
- Traefik receives request on ports `80/443`
- Route rules forward:
  - `Host(<domain>)` -> `frontend` container (`port 80`)
  - `Host(<domain>) && PathPrefix(/api)` -> `backend` container (`port 8080`)

This allows frontend and API to share one domain while keeping separate services.

## Repo Files Used for Deployment

At the repository root:

- `docker-compose.yml` - app services and Traefik labels
- `Dockerfile.backend` - backend container build/runtime
- `.env.example` - required deployment environment variables
- `.dockerignore` - excludes unnecessary files from build context

Inside `frontend/`:

- `Dockerfile` - builds static frontend and serves with Nginx
- `nginx.conf` - SPA routing config (`try_files ... /index.html`)
- `.dockerignore`

## First-Time Server Setup (Hetzner)

1. Install Docker and Docker Compose plugin on the server.
2. Create the shared Traefik network once:

```bash
docker network create app-network
```

3. Deploy Traefik (separate stack), configured to use:
   - Docker provider
   - network `app-network`
   - entrypoints `web` and `websecure`
   - Let's Encrypt TLS challenge

## Traefik Stack (Reference)

```yaml
version: "3.8"

services:
  traefik:
    image: traefik:latest
    container_name: traefik
    command:
      - "--api.dashboard=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=app-network"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
      - "--certificatesresolvers.letsencrypt.acme.tlschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@aarondevelop.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /opt/app/traefik/letsencrypt:/letsencrypt
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    external: true
```

## Application Deployment Steps

1. Clone the repo on server:

```bash
git clone <repo-url>
cd software-group
```

2. Create deployment env file:

```bash
cp .env.example .env
```

3. Update `.env`:

- `APP_HOST`: public domain for the app (example: `hotel.example.com`)
- `APP_CORS_ALLOWED_ORIGINS`: allowed origins for backend CORS
  - Example: `https://hotel.example.com,http://localhost:5173`

4. Build and start app containers:

```bash
docker compose up -d --build
```

5. Verify:

```bash
docker compose ps
docker compose logs -f backend frontend
```

If DNS is configured correctly and Traefik is running, the app should be available at `https://<APP_HOST>`.

## Local Development vs Production Routing

This project is configured so API calls use local behavior during development and Traefik routing in production:

- frontend API base URL defaults to `/api`
- Vite dev server proxies `/api` -> `http://localhost:8080`
- in production, Traefik routes `/api` to backend container

Result: the same frontend code works both locally and on the server.

## Data Persistence

The backend uses a named Docker volume:

- `booking-data` mounted at `/app/data`

This keeps `booking.db` persisted across container restarts/redeploys.

On first startup, backend container auto-initializes the SQLite database from `schema.sql` if the DB file does not exist.

## Useful Ops Commands

Rebuild and restart app:

```bash
docker compose up -d --build
```

View logs:

```bash
docker compose logs -f backend frontend
```

Stop app stack:

```bash
docker compose down
```

Note: `docker compose down` does not remove named volumes by default, so database data remains.
