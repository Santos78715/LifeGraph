# LifeGraph Docker Setup & Configuration

## Overview

This project uses Docker and Docker Compose to manage PostgreSQL database and Redis cache infrastructure. Prisma 8 (development version) is used as the ORM for database operations.

## Prerequisites

- Docker and Docker Compose installed
- Node.js v26.8.1 or later
- npm v11.19.0 or later

## Environment Setup

### 1. Environment Variables

A single `.env` file contains all configuration for PostgreSQL and Redis:

```
# PostgreSQL Database Configuration
DATABASE_URL="postgresql://lifegraph_user:lifegraph_password@localhost:5433/lifegraph_db"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT="6379"
```

**Note:**

- Port `5433` is used for PostgreSQL (port `5432` is typically occupied)
- Port `6379` is the standard Redis port

### 2. Docker Services Configuration

Two services run in Docker containers:

#### PostgreSQL

- **Database Name:** `lifegraph_db`
- **Username:** `lifegraph_user`
- **Password:** `lifegraph_password`
- **Port:** `5433` (maps to container port `5432`)
- **Image:** `postgres:16-alpine`

#### Redis

- **Port:** `6379`
- **Image:** `redis:7-alpine`
- **Persistence:** AOF (Append Only File) enabled
- **Health Check:** Redis PING command

### 3. Data Persistence

Persistent data is stored in Docker volumes:

- **PostgreSQL Volume:** `postgres_data`
- **Redis Volume:** `redis_data`
- **Location:** Docker managed storage

## Getting Started

### Start Services

```bash
cd /Users/santoshpokhrel/LifeGraph
docker-compose up -d
```

Verify both services are running:

```bash
docker-compose ps
```

### Stop Services

```bash
docker-compose down
```

To remove all data and start fresh:

```bash
docker-compose down -v
```

### Test Connectivity

**Test PostgreSQL:**

```bash
cd api && npx prisma db push
```

**Test Redis:**

```bash
docker exec lifegraph-redis redis-cli ping
# Should return: PONG
```

## Prisma Configuration

### Schema Location

- Schema file: `api/prisma/schema.prisma`
- Config file: `api/prisma.config.ts`

### Key Changes for Prisma 8

Prisma 8 introduced breaking changes:

1. **Datasource URL moved to config file**
   - Previously: `datasource db { url = env("DATABASE_URL") }` in schema.prisma
   - Now: Only provider in schema, URL in prisma.config.ts

2. **Removed deprecated engine option**
   - The `engine: "classic"` option is no longer supported

### Database Operations

#### Push schema to database

```bash
cd api
npx prisma db push
```

#### Generate Prisma Client

```bash
npx prisma generate
```

#### View database in Prisma Studio

```bash
npx prisma studio
```

#### Reset database (development only)

```bash
npx prisma db push --force-reset
```

## Building and Running the Project

### Install Dependencies

```bash
cd api
npm install
```

### Build the Project

```bash
npm run build
```

### Run Development Server

```bash
npm run start:dev
```

### Run Production Build

```bash
npm run start:prod
```

## Troubleshooting

### Port Already in Use

If ports are already in use, update `docker-compose.yml`:

**For PostgreSQL (default 5433):**

```yaml
ports:
  - "5434:5432" # Use a different port
```

Then update `.env`:

```
DATABASE_URL="postgresql://lifegraph_user:lifegraph_password@localhost:5434/lifegraph_db"
```

**For Redis (default 6379):**

```yaml
ports:
  - "6380:6379" # Use a different port
```

Then update `.env`:

```
REDIS_URL="redis://localhost:6380"
REDIS_PORT="6380"
```

### Connection Issues

1. Check if services are running:

   ```bash
   docker-compose ps
   ```

2. Check PostgreSQL logs:

   ```bash
   docker-compose logs postgres
   ```

3. Check Redis logs:

   ```bash
   docker-compose logs redis
   ```

4. Verify credentials in `.env`

5. Test PostgreSQL connection:

   ```bash
   npx prisma db push
   ```

6. Test Redis connection:
   ```bash
   docker exec lifegraph-redis redis-cli ping
   ```

### TypeScript/Build Errors

Ensure all dependencies are installed:

```bash
npm install
npm run build
```

## Project Structure

```
LifeGraph/
├── docker-compose.yml          # Docker services configuration (PostgreSQL + Redis)
├── DOCKER_SETUP.md               # This documentation
├── api/                          # Backend application
│   ├── .env                      # Environment variables (DO NOT commit)
│   ├── prisma.config.ts          # Prisma configuration
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Database migrations
│   ├── src/                      # Source code
│   ├── package.json              # Dependencies
│   └── tsconfig.json             # TypeScript configuration
└── web/                          # Frontend application
```

## Useful Commands

| Command                                      | Description                             |
| -------------------------------------------- | --------------------------------------- |
| `docker-compose up -d`                       | Start all services (PostgreSQL + Redis) |
| `docker-compose down`                        | Stop all services                       |
| `docker-compose down -v`                     | Stop services and remove volumes        |
| `docker-compose ps`                          | Check service status                    |
| `docker-compose logs postgres`               | View PostgreSQL logs                    |
| `docker-compose logs redis`                  | View Redis logs                         |
| `docker exec lifegraph-redis redis-cli ping` | Test Redis connection                   |
| `npx prisma db push`                         | Sync database schema                    |
| `npx prisma generate`                        | Generate Prisma Client                  |
| `npx prisma studio`                          | Open Prisma Studio UI                   |
| `npm run build`                              | Build the project                       |
| `npm run start:dev`                          | Start development server                |
| `npm run test`                               | Run tests                               |
| `npm run lint`                               | Run ESLint                              |

## Environment Variables Reference

| Variable       | Description                  | Default                                                                      |
| -------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://lifegraph_user:lifegraph_password@localhost:5433/lifegraph_db` |
| `REDIS_URL`    | Redis connection URL         | `redis://localhost:6379`                                                     |
| `REDIS_HOST`   | Redis hostname               | `localhost`                                                                  |
| `REDIS_PORT`   | Redis port                   | `6379`                                                                       |

## Notes

- Always ensure Docker is running before starting the application
- Keep `.env` file private and don't commit it to version control
- Never commit `.env` to git; use `.gitignore` to exclude it
- Data persists in Docker volumes even when containers are stopped
- Use `docker-compose down -v` to reset all data (development only)
- For production, use managed services (AWS RDS for PostgreSQL, AWS ElastiCache for Redis)
- Redis data is persisted with AOF (Append Only File) enabled
- Ensure both services are healthy before running the application

## References

- [Docker Documentation](https://docs.docker.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
