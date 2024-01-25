import {
  Injectable,
  CallHandler,
  HttpException,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const success = !(data instanceof HttpException);
        return {
          success,
          message: data?.message,
          data: data?.data,
        };
      }),
    );
  }
}
