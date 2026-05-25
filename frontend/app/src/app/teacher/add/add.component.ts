import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherService } from '../teacher.service';

@Component({
  selector: 'app-add',
  standalone: false,
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent implements OnInit {
  teacherForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  showError = false;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private router: Router
  ) {
    this.teacherForm = this.fb.group({
      indexNumber: ['', Validators.required],
      cin: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      facebook: [''],
      instagram: [''],
      linkedin: [''],
      specialization: ['', Validators.required],
      profileImage: [''],
      dateOfMandate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('✅ AddComponent initialized');
  }

  get f() {
    return this.teacherForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    console.log('✅ Form submitted');
    console.log('Form status:', this.teacherForm.status);
    console.log('Form value:', this.teacherForm.value);

    if (this.teacherForm.invalid) {
      console.error('❌ Form invalid');
      this.showError = true;
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement';
      for (const control in this.teacherForm.controls) {
        const c = this.teacherForm.get(control);
        if (c && c.invalid) {
          console.error(`Field ${control} invalid:`, c.errors);
        }
      }
      return;
    }

    this.loading = true;
    this.showError = false;
    const teacherData = this.teacherForm.value;
    console.log('📡 Creating teacher:', teacherData);

    this.teacherService.create(teacherData).subscribe({
      next: (res: any) => {
        console.log('✅ Teacher created:', res);
        this.loading = false;
        this.router.navigate(['/teacher']);
      },
      error: (err: any) => {
        console.error('❌ Error creating teacher:', err);
        this.loading = false;
        this.showError = true;
        this.errorMessage = err?.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/teacher']);
  }
}
