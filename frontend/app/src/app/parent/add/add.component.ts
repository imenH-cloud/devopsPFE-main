import { Component } from '@angular/core';
import { CreateParentDto } from '../parent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParentService } from '../parent.service';

@Component({
    selector: 'app-add',
    templateUrl: './add.component.html',
    styleUrl: './add.component.css',
    standalone: false
})
export class AddComponent {
  showError: boolean = false;
  errorMessage: string = '';
  parentForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private parentService: ParentService
  ) {
    this.parentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      NCIN: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      address: ['', Validators.required],
      typeInsurance: ['', Validators.required],
      Numeroinsurance: ['', Validators.required],
      job: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    console.log('✅ onSubmit called');
    console.log('Form status:', this.parentForm.status);
    console.log('Form value:', this.parentForm.value);
    
    this.submitted = true;
    this.showError = false;

    if (!this.parentForm.valid) {
      this.showError = true;
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement';
      console.error('❌ Form invalid - Status:', this.parentForm.status);
      for (const control in this.parentForm.controls) {
        const c = this.parentForm.get(control);
        if (c && c.invalid) {
          console.error(`Field ${control} invalid:`, c.errors);
        }
      }
      return;
    }

    this.loading = true;
    const parentData: CreateParentDto = this.parentForm.value;
    console.log('✅ Creating parent with data:', parentData);

    this.parentService.createParent(parentData).subscribe({
      next: (response) => {
        console.log('✅ Parent created successfully:', response);
        this.loading = false;
        this.router.navigate(['/parent/list']);
      },
      error: (error) => {
        console.error('❌ Error creating parent:', error);
        this.loading = false;
        this.showError = true;
        this.errorMessage = error?.error?.message || 'Erreur lors de la création du parent';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/parent/list']);
  }

  onCancel(): void {
    this.router.navigate(['/parent/list']);
  }
}
