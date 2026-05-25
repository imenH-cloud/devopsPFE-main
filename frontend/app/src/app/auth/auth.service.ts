import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Login, User } from './auth';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export default class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  loginUser(login: Login): Observable<any> {
    const url = `/auth/login`;
    console.log('Login URL:', url);
    console.log('Login credentials:', login);
    
    return this.http.post<any>(url, login);
  }
}

export function tokenGetter(platformId: object): string {
  if (!isPlatformBrowser(platformId)) {
    return "";
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    console.log('✅ Token found');
    return token;
  }
  
  console.warn('⚠️ No token');
  return "";
}
