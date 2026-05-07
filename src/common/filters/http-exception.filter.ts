import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;
    let error = exception.name;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const resObj = exceptionResponse as Record<string, unknown>;
      message = (resObj.message as string) || message;
      error = (resObj.error as string) || error;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? (message[0] as string) : message, // Handle ValidationPipe array messages
      error: error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
