import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private setLoading(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }

  get<T>(endpoint: string, params?: HttpParams): Observable<ApiResponse<T>> {
    this.setLoading(true);
    console.log('API GET:', endpoint);
    return this.http
      .get<ApiResponse<T>>(endpoint, { params, withCredentials: true })
      .pipe(
        tap(() => this.setLoading(false)),
        catchError((error) => {
          this.setLoading(false);
          console.error('API Error:', error);
          throw error;
        }),
      );
  }

  post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    this.setLoading(true);
    console.log('API POST:', endpoint);
    return this.http
      .post<ApiResponse<T>>(endpoint, body, { withCredentials: true })
      .pipe(
        tap(() => this.setLoading(false)),
        catchError((error) => {
          this.setLoading(false);
          console.error('API Error:', error);
          throw error;
        }),
      );
  }

  put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    this.setLoading(true);
    console.log('API PUT:', endpoint);
    return this.http
      .put<ApiResponse<T>>(endpoint, body, { withCredentials: true })
      .pipe(
        tap(() => this.setLoading(false)),
        catchError((error) => {
          this.setLoading(false);
          console.error('API Error:', error);
          throw error;
        }),
      );
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    this.setLoading(true);
    console.log('API DELETE:', endpoint);
    return this.http
      .delete<ApiResponse<T>>(endpoint, { withCredentials: true })
      .pipe(
        tap(() => this.setLoading(false)),
        catchError((error) => {
          this.setLoading(false);
          console.error('API Error:', error);
          throw error;
        }),
      );
  }

  // Pagination helper
  getPaginated<T>(
    endpoint: string,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<ApiResponse<PaginatedResponse<T>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.get<PaginatedResponse<T>>(endpoint, params);
  }
}
