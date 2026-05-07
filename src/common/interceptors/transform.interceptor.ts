import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((result: unknown) => {
        // If result is null/undefined
        if (result === undefined || result === null) {
          return {
            success: true,
            message: 'Operation successful',
            data: null as T,
          };
        }

        // Check if result is an object to safely access properties
        if (typeof result === 'object' && result !== null) {
          const resObj = result as Record<string, unknown>;

          // Handle case where result is already wrapped with data/meta (like findAll)
          if (resObj.data !== undefined) {
            return {
              success: true,
              message: (resObj.message as string) || 'Operation successful',
              data: resObj.data as T,
              meta: resObj.meta,
            };
          }

          // Handle case where result has a custom message
          if (resObj.message !== undefined) {
            const { message, ...data } = resObj;

            return {
              success: true,
              message: message as string,
              data: Object.keys(data).length > 0 ? (data as T) : (null as T),
            };
          }
        }

        // Default case: treat result as data
        return {
          success: true,
          message: 'Operation successful',
          data: result as T,
        };
      }),
    );
  }
}
