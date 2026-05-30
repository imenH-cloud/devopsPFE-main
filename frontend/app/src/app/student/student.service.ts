import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  parentId: number;
  classroomId: number;
  diagnosisType: string;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private http = inject(HttpClient);

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>('/student', { withCredentials: true });
  }

  getAllStudents(): Observable<Student[]> {
    return this.getAll();
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`/student/${id}`, { withCredentials: true });
  }

  getStudentById(id: number): Observable<Student> {
    return this.getById(id);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>('/student', student, { withCredentials: true });
  }

  createStudent(student: Student): Observable<Student> {
    return this.create(student);
  }

  createStudentWithFile(formData: FormData): Observable<Student> {
    return this.http.post<Student>('/student', formData, { withCredentials: true });
  }

  update(id: number, student: Student): Observable<Student> {
    return this.http.patch<Student>(`/student/${id}`, student, { withCredentials: true });
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.update(id, student);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`/student/${id}`, { withCredentials: true });
  }

  deleteStudent(id: number): Observable<any> {
    return this.delete(id);
  }
}
