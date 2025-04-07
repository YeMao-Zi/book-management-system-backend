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
    const status = exception.getStatus();
    // 统一错误响应格式
    const errorResponse = {
      code: status, // 使用 HTTP 状态码或自定义错误码
      message: exception.message || 'Internal Server Error',
      data: null,
    };
    response.status(status).json(errorResponse);
  }
}
