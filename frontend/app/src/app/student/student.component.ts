import { Component, OnInit } from '@angular/core';
import { StudentService, Student } from './student.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  standalone: false
})
export class StudentComponent implements OnInit {
  students: Student[] = [];
  showForm = false;
  studentForm!: FormGroup;
  isLoading = false;
  error = '';
  success = '';

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.initializeForm();
  }

  initializeForm(): void {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      parentId: ['', Validators.required],
      classroomId: ['', Validators.required],
      diagnosisType: ['', Validators.required],
      notes: ['']
    });
  }

  loadStudents(): void {
    this.isLoading = true;
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des enfants';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) return;
    
    this.isLoading = true;
    this.error = '';
    this.success = '';

    this.studentService.create(this.studentForm.value).subscribe({
      next: (student) => {
        this.success = `Enfant ${student.firstName} ${student.lastName} créé avec succès!`;
        this.studentForm.reset();
        this.showForm = false;
        this.loadStudents();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Erreur lors de la création de l\'enfant';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.studentForm.reset();
      this.error = '';
    }
  }

  deleteStudent(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enfant?')) {
      this.studentService.delete(id).subscribe({
        next: () => {
          this.success = 'Enfant supprimé avec succès!';
          this.loadStudents();
        },
        error: (err: any) => {
          this.error = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
  }
}
