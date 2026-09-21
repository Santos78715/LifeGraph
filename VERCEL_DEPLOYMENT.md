# Vercel deployment

The repository root is the Vercel project root. The API is deployed from
`api/src/serverless.ts`; Swagger is available at `/api-docs` after deployment.

## Required services

- PostgreSQL with the `vector` extension
- Redis reachable over TLS (`rediss://`) where required
- A separate always-on worker deployment for `npm --prefix api run start:worker`

Vercel functions must not run the BullMQ worker because they are not durable.

## Required Vercel environment variables

Set these for Preview and Production in the Vercel dashboard before deploying:

```text
DATABASE_URL
REDIS_URL
API_KEY
JWT_SECRET
JWT_EXPIRATION=7d
CORS_ORIGIN=https://your-frontend.example
NODE_ENV=production
```

`JWT_SECRET` must contain at least 32 characters. Run database migrations from
a trusted CI job or administrator machine before publishing:

```bash
cd api
npx prisma migrate deploy
```

## Publish

```bash
npx vercel link
npx vercel --prod
```

After deployment, verify:

```text
GET https://<deployment>/health
GET https://<deployment>/api-docs
```
