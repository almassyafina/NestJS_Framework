import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

//definisikan formatnya terlebuh dahulu
export interface StandardResponse<T>{
  success: boolean,
  message: string,
  statusCode: number,
  data: T
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
    // update context
    const httpContext = context.switchToHttp()
    const response = httpContext.getResponse()
    const currentStatuscode = response.statusCode


    return next.handle().pipe(
  map((originalData) => ({
    success: true,
    message: "Data berhasil diambil",
    statusCode: currentStatuscode,
    data: originalData ?? null,
  })),
      );

      }
    };
  

