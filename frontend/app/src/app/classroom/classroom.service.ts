import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Classroom {
  id?: number;
  name: string;
  level: string;
  capacity: number;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ClassroomService {
  private http = inject(HttpClient);
  
  getAll(): Observable<Classroom[]> { 
    return this.http.get<Classroom[]>('/classroom', { withCredentials: true }); 
  }
  
  findAll(): Observable<Classroom[]> { 
    return this.getAll(); 
  }
  
  findOne(id: number): Observable<Classroom> { 
    return this.http.get<Classroom>(`/classroom/${id}`, { withCredentials: true }); 
  }
  
  create(classroom: Classroom): Observable<Classroom> { 
    return this.http.post<Classroom>('/classroom', classroom, { withCredentials: true }); 
  }
  
  update(id: number, classroom: Classroom): Observable<Classroom> { 
    return this.http.patch<Classroom>(`/classroom/${id}`, classroom, { withCredentials: true }); 
  }
  
  delete(id: number): Observable<any> { 
    return this.http.delete(`/classroom/${id}`, { withCredentials: true }); 
  }
  
  remove(id: number): Observable<any> { 
    return this.delete(id); 
  }
}
