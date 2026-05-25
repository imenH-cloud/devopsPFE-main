import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parent } from './parent';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private http = inject(HttpClient);

  getAll(): Observable<Parent[]> {
    return this.http.get<Parent[]>('/parent', { withCredentials: true });
  }

  getParents(): Observable<Parent[]> {
    return this.getAll();
  }

  getById(id: number): Observable<Parent> {
    return this.http.get<Parent>(`/parent/${id}`, { withCredentials: true });
  }

  getParentById(id: number): Observable<Parent> {
    return this.getById(id);
  }

  create(parent: Partial<Parent>): Observable<Parent> {
    console.log('Creating parent via API:', '/parent', parent);
    return this.http.post<Parent>('/parent', parent, { withCredentials: true });
  }

  createParent(parent: Partial<Parent>): Observable<Parent> {
    return this.create(parent);
  }

  update(id: number, parent: Partial<Parent>): Observable<Parent> {
    return this.http.patch<Parent>(`/parent/${id}`, parent, { withCredentials: true });
  }

  updateParent(id: number, parent: Partial<Parent>): Observable<Parent> {
    return this.update(id, parent);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`/parent/${id}`, { withCredentials: true });
  }

  deleteParent(id: number): Observable<any> {
    return this.delete(id);
  }

  deleteMultipleParents(ids: number[]): Observable<any> {
    return this.http.post('/parent/delete-multiple', { ids }, { withCredentials: true });
  }
}
