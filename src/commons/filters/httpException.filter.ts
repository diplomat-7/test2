import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let data: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      data = exception.getResponse();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      data = {
        message: 'An error has occurred, please try again later',
        error: 'Server Error',
        statusCode: status,
      };

      console.log('exception', exception);
    }

    response.status(status).json({
      success: false,
      data,
    });
  }
}
