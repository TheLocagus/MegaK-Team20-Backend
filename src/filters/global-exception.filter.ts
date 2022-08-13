import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export const getStatusCode = <T>(exception: T): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = <T>(exception: T): string => {
  return exception instanceof HttpException
    ? exception.message
    : String(exception);
};

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = getStatusCode<T>(exception);
    let message;

    if (statusCode === 400) {
      const error = exception['response']['message'];
      console.log({ error, statusCode });
      message = Object.values(error[0]['constraints'])[0];
    } else {
      message = getErrorMessage<T>(exception);
    }

    console.log();

    response.status(404).json({
      success: false,
      message,
    });
  }
}
