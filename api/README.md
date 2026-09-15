# LifeGraph API

LifeGraph turns journals into a personal memory graph. Journal jobs extract entities, memories, and relationships; memories are embedded with Gemini and retrieved through PostgreSQL + pgvector for grounded answers.

## Requirements

- Node.js 22
- PostgreSQL with the `vector` extension (the included Docker Compose service provides it)
- Redis 7+
- Gemini API key

## Configuration

Create `api/.env` with:

```dotenv
DATABASE_URL=postgresql://lifegraph_user:lifegraph_password@localhost:5433/lifegraph_db
REDIS_URL=redis://localhost:6379
API_KEY=your_gemini_api_key
JWT_SECRET=use-a-long-random-production-secret
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:3000
```

## Local development

```bash
docker compose up -d
cd api
npm ci
npx prisma migrate deploy
npm run start:dev
```

Run the queue worker in a separate terminal:

```bash
cd api
npm run start:worker
```

## Main flow

1. Register and log in through `/auth`.
2. Create a journal entry with `POST /journal`.
3. The worker extracts graph records and creates a vector embedding for every memory.
4. Send plaintext, Markdown, or JSON knowledge with authenticated `POST /documents/text`. It is chunked and embedded immediately.
5. Analyze a document with `POST /documents/:id/analyze`, or ask a grounded question with authenticated `POST /search`.

```json
{ "query": "What projects have I been working on?", "limit": 8 }
```

`/search` embeds the question, retrieves only the authenticated user's memory vectors using cosine similarity, and returns an answer plus numbered source memories. It will not invent an answer when no memory is retrieved.

## Production deployment

- Apply Prisma migrations before running the API (`npx prisma migrate deploy`).
- Host the HTTP API on Vercel or another Node-compatible function host.
- Run `npm run start:worker` on an always-on service. A Vercel request function is not a durable BullMQ worker.
- Use a pgvector-enabled managed PostgreSQL database and managed Redis.
- Set all configuration values above as deployment secrets; do not commit `.env` files.

## Verification

```bash
npm test -- --runInBand
npm run build
```
