import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse();
    const request = http.getRequest();
    const mappedException = this.mapException(exception);
    const status = mappedException.getStatus();
    const body = mappedException.getResponse();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof body === 'string' ? { message: body } : body),
    });
  }

  private mapException(exception: Prisma.PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P2002':
        return new ConflictException({
          message: 'A record with this unique value already exists',
          fields: this.getTargetFields(exception),
        });
      case 'P2003':
        return new BadRequestException({
          message: 'Related record does not exist',
          field: exception.meta?.field_name,
        });
      case 'P2025':
        return new NotFoundException('Record not found');
      default:
        return new BadRequestException({
          message: 'Database request failed',
          code: exception.code,
        });
    }
  }

  private getTargetFields(exception: Prisma.PrismaClientKnownRequestError) {
    const target = exception.meta?.target;
    return Array.isArray(target) ? target : undefined;
  }
}
