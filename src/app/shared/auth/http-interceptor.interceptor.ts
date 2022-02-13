import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { finalize, tap } from 'rxjs/operators';
import { VisualFeedbackService } from '../loading/loading.service';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private loadingService: VisualFeedbackService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.headers.get('Ignore') !== 'true') {
      const token = this.authService.getToken();
      if (token) {

        this.loadingService.setLoading(request.url, true);

        return next.handle(this.injectToken(request)).pipe(

          finalize(() => {

            this.loadingService.setLoading(request.url, false);
          })

          // tap((evt) => {

          //   if(evt instanceof HttpResponse) {

          //     this.loadingService.setLoading(request.url, false);
          //   }
          // })

        );
      }
    }
    // If a request with a header ignore don't handle the request and delete the Flag = "Ignore"
    const newHeader = request.headers.delete('Ignore');
    const newRequest = request.clone({ headers: newHeader });

    const nextObservable = next.handle(newRequest);

    return nextObservable;
  }

  injectToken(request: HttpRequest<any>) {
    const token = this.authService.getToken();
    // console.log(token);
    return request.clone({
      setHeaders: {
        Tokenstring: token,
      },
    });
  }
}
