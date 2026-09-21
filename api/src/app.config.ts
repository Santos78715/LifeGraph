import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

export function configureApp(app: INestApplication) {
  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = process.env.CORS_ORIGIN
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.enableCors({
    origin: allowedOrigins?.length ? allowedOrigins : !isProduction,
    credentials: true,
  });
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.useGlobalFilters(new PrismaExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}

export function validateEnvironment(environment: Record<string, unknown>) {
  const required = ['DATABASE_URL', 'REDIS_URL', 'API_KEY', 'JWT_SECRET'];
  const missing = required.filter((key) => !environment[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  if (String(environment.JWT_SECRET).length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  if (environment.NODE_ENV === 'production' && !environment.CORS_ORIGIN) {
    throw new Error('CORS_ORIGIN must be configured in production');
  }
  return environment;
}
