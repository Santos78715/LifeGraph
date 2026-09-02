# Authentication & Authorization Setup

## Overview

This project includes JWT-based authentication, role-based access control via Guards, global rate limiting, and a database of 22 seeded test users.

## Features Implemented

### 1. **User Model** (Prisma)
- `id`: Unique identifier (CUID)
- `email`: Unique email address
- `name`: User's full name
- `password`: Hashed password (bcrypt)
- `timezone`: User's timezone (default: UTC)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### 2. **JWT Authentication**
- **Strategy**: Passport JWT with Bearer token authentication
- **Secret**: `JWT_SECRET` environment variable
- **Expiration**: `JWT_EXPIRATION` environment variable (default: 7d)
- **Flow**: Login → Get JWT token → Use token in Authorization header

### 3. **Authorization Guards**
- **JwtAuthGuard**: Protects endpoints requiring authentication
- **Protected Routes**: Routes decorated with `@UseGuards(JwtAuthGuard)` require valid JWT tokens

### 4. **Global Rate Limiting**
- **Throttler Module**: Implements request rate limiting at application level
- **Default Limits**: 10 requests per 60 seconds globally
- **Customizable**: Can be configured per route or globally

### 5. **Database Seeding**
- **22 Test Users**: Pre-populated with diverse user data
- **Default Password**: `password123` (hashed with bcrypt)
- **Command**: `npm run seed`
- **Seeded Data**: Users across different timezones

## API Endpoints

### Authentication Routes

#### 1. **Register User**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "New User",
  "timezone": "America/New_York"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "newuser@example.com",
      "name": "New User",
      "timezone": "America/New_York"
    }
  }
}
```

#### 2. **Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "alice@example.com",
      "name": "Alice Johnson",
      "timezone": "America/New_York"
    }
  }
}
```

#### 3. **Get Profile** (Protected)
```http
GET /auth/profile
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "alice@example.com",
    "name": "Alice Johnson",
    "timezone": "America/New_York",
    "createdAt": "2026-09-02T16:00:00.000Z",
    "updatedAt": "2026-09-02T16:00:00.000Z"
  }
}
```

## Testing Authentication

### 1. **Quick Login Test**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
```

### 2. **Protected Endpoint Test**
```bash
# First, get a token from login
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}' | jq -r '.data.access_token')

# Then use it to access protected routes
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 3. **Rate Limiting Test**
```bash
# Send multiple requests rapidly to trigger rate limit
for i in {1..15}; do
  curl -X GET http://localhost:3000/auth/profile \
    -H "Authorization: Bearer <token>" &
done
# After 10 requests per minute, you'll get 429 Too Many Requests
```

## Seeded Test Users

All users have the password: `password123`

| Email | Name | Timezone |
|-------|------|----------|
| alice@example.com | Alice Johnson | America/New_York |
| bob@example.com | Bob Smith | America/Chicago |
| charlie@example.com | Charlie Brown | America/Denver |
| diana@example.com | Diana Prince | America/Los_Angeles |
| eve@example.com | Eve Wilson | Europe/London |
| frank@example.com | Frank Miller | Europe/Paris |
| grace@example.com | Grace Lee | Asia/Tokyo |
| henry@example.com | Henry Davis | Asia/Shanghai |
| iris@example.com | Iris Martinez | America/Mexico_City |
| jack@example.com | Jack Robinson | Europe/Berlin |
| karen@example.com | Karen White | Australia/Sydney |
| liam@example.com | Liam OBrien | Europe/Dublin |
| maya@example.com | Maya Patel | Asia/Kolkata |
| noah@example.com | Noah Taylor | Pacific/Auckland |
| olivia@example.com | Olivia Garcia | America/Argentina/Buenos_Aires |
| peter@example.com | Peter Anderson | Europe/Amsterdam |
| quinn@example.com | Quinn Stewart | America/Toronto |
| rachel@example.com | Rachel Green | America/New_York |
| sam@example.com | Sam Johnson | Europe/Rome |
| tara@example.com | Tara Singh | Asia/Bangkok |
| uma@example.com | Uma Kumar | Asia/Dubai |
| victor@example.com | Victor Hernandez | America/Mexico_City |

## Security Considerations

1. **JWT Secret**: Change `JWT_SECRET` in production
2. **Password Hashing**: All passwords are hashed with bcrypt (10 salt rounds)
3. **Environment Variables**: Keep `.env` file private and don't commit to git
4. **HTTPS**: Always use HTTPS in production
5. **Token Expiration**: Tokens expire after the configured duration (default: 7 days)
6. **Rate Limiting**: Protects against brute force and DoS attacks

## Files Structure

```
src/
├── auth/
│   ├── auth.service.ts          # Authentication logic
│   ├── auth.controller.ts       # Auth endpoints
│   ├── auth.module.ts           # Auth module definition
│   ├── jwt.strategy.ts          # JWT strategy implementation
│   └── jwt-auth.guard.ts        # Auth guard
├── prisma/
│   ├── prisma.service.ts        # Prisma client wrapper
│   └── prisma.module.ts         # Prisma module
├── app.module.ts                # Root module with Throttler
├── main.ts                      # Application bootstrap
└── ...
prisma/
├── schema.prisma                # Database schema
└── seed.ts                      # Database seeding script
```

## Environment Variables

```env
# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="7d"

# Database
DATABASE_URL="postgresql://user:password@localhost:5433/database"

# Redis (for future use)
REDIS_URL="redis://localhost:6379"
REDIS_HOST="localhost"
REDIS_PORT="6379"

# Application
NODE_ENV="development"
```

## Running the Application

```bash
# Install dependencies
npm install

# Seed database with test users
npm run seed

# Build project
npm run build

# Start development server
npm run start:dev

# Start production server
npm run start:prod
```

## Next Steps

1. Implement role-based access control (RBAC)
2. Add refresh token mechanism
3. Implement email verification
4. Add password reset functionality
5. Set up JWT token blacklist/revocation
6. Add audit logging for auth events
7. Implement 2FA (Two-Factor Authentication)
8. Add OAuth2/SSO integration

## Troubleshooting

### Issue: "Cannot find module '@prisma/adapter-pg'"
**Solution**: Install with `npm install @prisma/adapter-pg --legacy-peer-deps`

### Issue: Database connection refused
**Solution**: Verify PostgreSQL is running with `docker-compose ps` and check credentials in `.env`

### Issue: "Unauthorized" error on protected routes
**Solution**: Ensure JWT token is passed in Authorization header as `Bearer <token>`

### Issue: Rate limit triggered (429 error)
**Solution**: Wait 60 seconds for rate limit to reset, or adjust throttle settings in `app.module.ts`

## References

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport.js](http://www.passportjs.org/)
- [JWT (JSON Web Token)](https://jwt.io/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Bcrypt](https://github.com/dcodeIO/bcrypt.js)
