import { Injectable, Injector } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: localStorage.getItem("TOKEN")
      }
    });
    return next.handle(request);
  }
}
