import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceResponse } from './response.interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req?.method ?? undefined;

    return next.handle().pipe(
      map((data) => {
        // If controller already returned formatted response, pass through
        if (data && data.success !== undefined && data.timestamp) return data;

        const res: ServiceResponse = {
          success: true,
          message: '',
          method,
          timestamp: new Date().toISOString(),
          data: data === undefined ? null : data,
        };
        // If data is an object with 'message' or 'error', surface it
        if (data && typeof data === 'object') {
          if (data.message) res.message = data.message;
          if (data.error) res.message = data.error;
        }
        return res;
      }),
    );
  }
}
