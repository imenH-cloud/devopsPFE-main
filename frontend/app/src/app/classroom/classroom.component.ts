import { Component, OnInit } from '@angular/core';
import { ClassroomService, Classroom } from './classroom.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css'],
  standalone: false
})
export class ClassroomComponent implements OnInit {
  classrooms: Classroom[] = [];
  showForm = false;
  classroomForm!: FormGroup;
  isLoading = false;
  error = '';
  success = '';

  constructor(
    private classroomService: ClassroomService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadClassrooms();
    this.initializeForm();
  }

  initializeForm(): void {
    this.classroomForm = this.fb.group({
      name: ['', Validators.required],
      level: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  loadClassrooms(): void {
    this.isLoading = true;
    this.classroomService.getAll().subscribe({
      next: (data) => {
        this.classrooms = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des classes';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.classroomForm.invalid) return;
    
    this.isLoading = true;
    this.error = '';
    this.success = '';

    this.classroomService.create(this.classroomForm.value).subscribe({
      next: (classroom) => {
        this.success = `Classe ${classroom.name} créée avec succès!`;
        this.classroomForm.reset();
        this.showForm = false;
        this.loadClassrooms();
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
      this.classroomForm.reset();
      this.error = '';
    }
  }

  deleteClassroom(id: number): void {
    if (confirm('Êtes-vous sûr?')) {
      this.classroomService.delete(id).subscribe({
        next: () => {
          this.success = 'Classe supprimée!';
          this.loadClassrooms();
        },
        error: (err: any) => this.error = 'Erreur lors de la suppression'
      });
    }
  }
}
