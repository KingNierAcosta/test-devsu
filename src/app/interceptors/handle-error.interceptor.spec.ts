import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpInterceptorFn, HttpStatusCode, provideHttpClient, withInterceptors } from '@angular/common/http';

import { handleErrorInterceptor } from './handle-error.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

describe('handleErrorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => handleErrorInterceptor(req, next));
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        provideHttpClient(withInterceptors([handleErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should handle BadRequest error', () => {
    const errorMessage = 'Bad request';
    const url = '/api/some-endpoint';
    const spyAttach = jest.spyOn(notificationService, 'showNotification');

    httpClient.get(url).pipe(
      catchError((error: HttpErrorResponse) => {
        expect(spyAttach).toHaveBeenCalledWith(errorMessage, 'error');
        return throwError(() => error);
      })
    ).subscribe();

    const req = httpMock.expectOne(url);
    req.error(new ProgressEvent('Progress'), { status: HttpStatusCode.BadRequest });
  });

  it('should handle 206 status code with HttpResponse', () => {
    const responseBody = { key: 'value' };
    const url = '/api/some-endpoint';
    const spyAttach = jest.spyOn(notificationService, 'showNotification');

    httpClient.get(url).subscribe((response) => {
      expect(spyAttach).toHaveBeenCalledWith('key: value<br>', 'error');
    });

    const req = httpMock.expectOne(url);
    req.flush(responseBody, { status: 206, statusText: 'Partial Content' });
  });
});
