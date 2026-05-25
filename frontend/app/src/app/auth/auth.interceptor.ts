import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { tokenGetter } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = tokenGetter(this.platformId);
    
    if (token) {
      req = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
    
    return next.handle(req).pipe(
      catchError((err: any) => {
        if (err.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('idUser');
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => err);
      })
    );
  }
}
