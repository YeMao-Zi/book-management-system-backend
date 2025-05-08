import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class MapTestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    return next.handle().pipe(
      map((res = {}) => {
        const { code, message, data } = res;
        return {
          code: code || statusCode,
          message: message || 'success',
          data: data || res,
        };
      }),
    );
  }
}
