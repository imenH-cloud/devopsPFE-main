import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClassroomService } from '../classroom.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrl: './add.component.css',
    standalone: false
})
export class AddComponent {
  classroomForm: FormGroup;
  submitted = false;
  loading = false;
  showError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private classroomService: ClassroomService,
    private router: Router
  ) {
    this.classroomForm = this.fb.group({
      name: ['', Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]],
      grade: ['', Validators.required],
      academicYear: ['', Validators.required],
      description: [''],
      isActive: [true],
      location: ['', Validators.required],
      Specialization: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.classroomForm.controls;
  }

  onSubmit(): void {
    console.log('✅ onSubmit called');
    console.log('Form status:', this.classroomForm.status);
    console.log('Form value:', this.classroomForm.value);
    
    this.submitted = true;
    this.showError = false;

    if (!this.classroomForm.valid) {
      this.showError = true;
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement';
      console.error('❌ Form invalid - Status:', this.classroomForm.status);
      for (const control in this.classroomForm.controls) {
        const c = this.classroomForm.get(control);
        if (c && c.invalid) {
          console.error(`Field ${control} invalid:`, c.errors);
        }
      }
      return;
    }

    this.loading = true;
    console.log('✅ Creating classroom with data:', this.classroomForm.value);

    this.classroomService.create(this.classroomForm.value).subscribe({
      next: (response: any) => {
        console.log('✅ Classroom created successfully:', response);
        this.loading = false;
        this.router.navigate(['/classroom']);
      },
      error: (error: any) => {
        console.error('❌ Error creating classroom:', error);
        this.loading = false;
        this.showError = true;
        this.errorMessage = error?.error?.message || 'Erreur lors de la création de la salle de classe';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/classroom']);
  }
}
