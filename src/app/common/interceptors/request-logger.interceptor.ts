import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

type RequestLoggerInterceptorOptions = {
  showRequestURI: boolean
  showHeaders: boolean,
  showBody: boolean,
};

const TagsEnum = {
  SUCCESS: '✅',
  WARNING: '⚠️',
  ERROR: '❌',
  SLOW: '🐌',
  MEDIUM: '🚨',
  FAST: '🚀',
} as const;

const RequestDurationTagsEnum = {
  SLOW: 1000,
  MEDIUM: 300,
} as const;

export class RequestLoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly options: RequestLoggerInterceptorOptions = {
      showRequestURI: true,
      showHeaders: false,
      showBody: true,
    }
  ) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    const logger = new Logger('Request Logger Interceptor');
    const request = context.switchToHttp().getRequest();
    const requestStartTime = Date.now();

    if (this.options.showRequestURI) {
      logger.log(`Request: ${request.method} ${request.url}`);
    }

    if (this.options.showHeaders) {
      logger.log(`Request headers:`);
      logger.log(request.rawHeaders);
    }

    if (this.options.showBody && request.body && Object.keys(request.body).length > 0) {
      logger.log('Request body:');
      logger.log(request.body);
    }

    return next.handle()
      .pipe(
        tap({
          next: () => {
            const { SLOW: SLOW_THRESHOLD } = RequestDurationTagsEnum;
            const { MEDIUM: MEDIUM_THRESHOLD } = RequestDurationTagsEnum;
            const { SLOW, MEDIUM, FAST } = TagsEnum;

            const requestDuration = Date.now() - requestStartTime;
            const tag = requestDuration > SLOW_THRESHOLD
              ? SLOW
              : (requestDuration > MEDIUM_THRESHOLD)
                ? MEDIUM
                : FAST;

            logger.log(`Request duration: ${tag} ${requestDuration}ms`);
          },
          error: (error) => {
            const requestDuration = Date.now() - requestStartTime;
            const tag = TagsEnum.ERROR;
            const status = error?.status || 500;

            logger.error(`${tag} ${requestDuration}ms — ${status} ${error?.message || ''}`);
          }
        })
      );
  }
}
