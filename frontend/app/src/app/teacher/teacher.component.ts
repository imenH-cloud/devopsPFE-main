import { Component, OnInit } from '@angular/core';
import { TeacherService, Teacher } from './teacher.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
  standalone: false
})
export class TeacherComponent implements OnInit {
  teachers: Teacher[] = [];
  showForm = false;
  teacherForm!: FormGroup;
  isLoading = false;
  error = '';
  success = '';

  constructor(
    private teacherService: TeacherService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
    this.initializeForm();
  }

  initializeForm(): void {
    this.teacherForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      specialization: ['', Validators.required],
      qualification: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0)]],
      availability: ['']
    });
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.teacherService.getAll().subscribe({
      next: (data) => {
        this.teachers = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des intervenants';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.teacherForm.invalid) return;
    
    this.isLoading = true;
    this.error = '';
    this.success = '';

    this.teacherService.create(this.teacherForm.value).subscribe({
      next: (teacher) => {
        this.success = `Intervenant ${teacher.firstName} ${teacher.lastName} créé avec succès!`;
        this.teacherForm.reset();
        this.showForm = false;
        this.loadTeachers();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Erreur lors de la création';
        this.isLoading = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.teacherForm.reset();
      this.error = '';
    }
  }

  deleteTeacher(id: number): void {
    if (confirm('Êtes-vous sûr?')) {
      this.teacherService.delete(id).subscribe({
        next: () => {
          this.success = 'Intervenant supprimé!';
          this.loadTeachers();
        },
        error: (err: any) => this.error = 'Erreur lors de la suppression'
      });
    }
  }
}
