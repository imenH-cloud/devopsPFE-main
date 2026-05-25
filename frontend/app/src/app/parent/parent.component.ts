import { Component, OnInit } from '@angular/core';
import { ParentService, Parent } from './parent.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css'],
  standalone: false
})
export class ParentComponent implements OnInit {
  parents: Parent[] = [];
  showForm = false;
  parentForm!: FormGroup;
  isLoading = false;
  error = '';
  success = '';

  constructor(
    private parentService: ParentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadParents();
    this.initializeForm();
  }

  initializeForm(): void {
    this.parentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      NCIN: ['', Validators.required],
      address: ['', Validators.required],
      typeInsurance: ['', Validators.required],
      Numeroinsurance: ['', Validators.required],
      job: ['', Validators.required]
    });
  }

  loadParents(): void {
    this.isLoading = true;
    this.parentService.getAll().subscribe({
      next: (data) => {
        this.parents = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des parents';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.parentForm.invalid) return;
    
    this.isLoading = true;
    this.error = '';
    this.success = '';

    this.parentService.create(this.parentForm.value).subscribe({
      next: (parent) => {
        this.success = `Parent ${parent.firstName} ${parent.lastName} créé avec succès!`;
        this.parentForm.reset();
        this.showForm = false;
        this.loadParents();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création du parent';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.parentForm.reset();
      this.error = '';
    }
  }

  deleteParent(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce parent?')) {
      this.parentService.delete(id).subscribe({
        next: () => {
          this.success = 'Parent supprimé avec succès!';
          this.loadParents();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
  }
}
