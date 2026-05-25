import { Component } from '@angular/core';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';
import { Student } from '../../parent/parent';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrl: './list.component.css',
    standalone: false
})
export class ListComponent {
  students: any[] = [];
  filteredStudents: any[] = [];
  selectedStudents: any[] = [];
  searchTerm = '';
  classroomFilter = '';
  gradeFilter = '';
  loading = false;
  uniqueClassrooms: string[] = [];
  uniqueGrades: string[] = [];

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAllStudents().subscribe({
      next: (students:any) => {
        this.students = students;
        this.filteredStudents = students;
        this.extractUniqueValues();
        this.loading = false;
      },
      error: (error:any) => {
        console.error('Error loading students:', error);
        this.loading = false;
      }
    });
  }

  extractUniqueValues(): void {
    this.uniqueClassrooms = [...new Set(this.students
        .map(s => s.classroom?.name)
        .filter(name => name)) as unknown as string[]];
      
    this.uniqueGrades = [...new Set(this.students
        .map(s => s.classroom?.grade)
        .filter(grade => grade)) as unknown as string[]];
  }

  filterStudents(): void {
    this.filteredStudents = this.students.filter(student => {
      const matchesSearch = !this.searchTerm || 
        student.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.phoneNumber.includes(this.searchTerm) ||
        student.parents?.some((p:any) => 
          p.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
          p.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      
      const matchesClassroom = !this.classroomFilter || 
        student.classroom?.name === this.classroomFilter;
      
      const matchesGrade = !this.gradeFilter || 
        student.classroom?.grade === this.gradeFilter;

      return matchesSearch && matchesClassroom && matchesGrade;
    });
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedStudents = this.filteredStudents.map(student => student.id);
    } else {
      this.selectedStudents = [];
    }
  }

  toggleStudentSelection(studentId: number, event: any): void {
    if (event.target.checked) {
      this.selectedStudents.push(studentId);
    } else {
      this.selectedStudents = this.selectedStudents.filter(id => id !== studentId);
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/student/add']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/student/update', id]);
  }

  viewStudent(id: number): void {
    this.router.navigate(['/students/view', id]);
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (error) => {
          console.error('Error deleting student:', error);
          alert('Error deleting student. Please try again.');
        }
      });
    }
  }

  deleteSelected(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedStudents.length} selected students? This action cannot be undone.`)) {
      // this.studentService.deleteStudent(this.selectedStudents).subscribe({
      //   next: () => {
      //     this.selectedStudents = [];
      //     this.loadStudents();
      //   },
      //   error: (error) => {
      //     console.error('Error deleting students:', error);
      //     alert('Error deleting students. Please try again.');
      //   }
      // });
    }
  }
}
