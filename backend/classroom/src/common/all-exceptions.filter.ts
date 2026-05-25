import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: any = exception;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = (exceptionResponse as any).message || exception.message;
      error = exceptionResponse;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log the full error - VERY IMPORTANT FOR DEBUGGING
    console.error('[❌ ALL EXCEPTIONS FILTER]', {
      timestamp: new Date().toISOString(),
      status,
      message,
      path: request.url,
      method: request.method,
      fullError: exception instanceof Error ? exception.stack : String(exception),
    });

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: error instanceof HttpException ? error : { message },
    });
  }
}
