import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Activity {
  id?: number;
  title?: string;
  name?: string;
  description: string;
  studentId?: number;
  type: string;
  date: string;
  duration: number;
  notes?: string;
  location?: string;
  isCompleted?: boolean;
  classroom?: { id: number };
  classroomId?: number;
  metadata?: {
    resources?: string[];
    attachments?: string[];
    comments?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);
  
  getAll(): Observable<Activity[]> { 
    return this.http.get<Activity[]>('/activity', { withCredentials: true }); 
  }
  
  findAll(): Observable<Activity[]> { 
    return this.getAll(); 
  }
  
  getById(id: number): Observable<Activity> { 
    return this.http.get<Activity>(`/activity/${id}`, { withCredentials: true }); 
  }
  
  create(activity: Activity): Observable<Activity> { 
    return this.http.post<Activity>('/activity', activity, { withCredentials: true }); 
  }
  
  update(id: number, activity: Activity): Observable<Activity> { 
    return this.http.patch<Activity>(`/activity/${id}`, activity, { withCredentials: true }); 
  }
  
  delete(id: number): Observable<any> { 
    return this.http.delete(`/activity/${id}`, { withCredentials: true }); 
  }
}
