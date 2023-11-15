import { HttpErrorResponse, HttpInterceptorFn, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const handleErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error && error.error) {
        switch (error.status) {
          case HttpStatusCode.BadRequest:
          case HttpStatusCode.Unauthorized:
          case HttpStatusCode.NotFound:
            notificationService.showNotification(error.error.message, 'error');
            break;
        }
      }

      return throwError(() => error);
    }),
    tap(event => {
      if (event instanceof HttpResponse && event.status === 206) {
        notificationService.showNotification(buildMsg(event.body), 'error');
      }
    })
  )


  function buildMsg(body: any) {
    let msg = '';
    for (const [clave, valor] of Object.entries(body)) {
      msg += `${clave}: ${valor}<br>`;
    }

    return msg;
  }
};
