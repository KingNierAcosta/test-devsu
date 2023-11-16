import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClient,
  HttpClientModule, provideHttpClient, withInterceptors
} from '@angular/common/http';

import { authInterceptor } from './auth.interceptor';
import {
  HttpTestingController,
  TestRequest,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should add a custom header to the request', inject(
    [HttpClient],
    (http: HttpClient) => {
      const url = '/api/data';

      http.get(url).subscribe();

      const httpRequest: TestRequest = httpMock.expectOne(url);

      expect(httpRequest.request.headers.has('authorId')).toBeTruthy();
      expect(httpRequest.request.headers.get('authorId')).toBe('103');
    }
  ));
});
