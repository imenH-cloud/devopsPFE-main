import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../student.service';
import { ParentService } from '../../parent/parent.service';
import { ClassroomService } from '../../classroom/classroom.service';

@Component({
    selector: 'app-add-student',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.css'],

    standalone: false
})
export class AddStudentComponent implements OnInit {
  studentForm: FormGroup;
  submitted = false;
  loading: boolean=false;
  parents: any;
  classrooms: any;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router, private parentService: ParentService,
    private classormService: ClassroomService
  ) {
  this.studentForm = this.fb.group({
  firstName: ['', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
  ]],
  lastName: ['', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
    Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
  ]],
  numeroInscriptio: ['', [
    Validators.required,
    Validators.pattern(/^[A-Z]{3}\d{4}\d{3}$/)
  ]],
  email: ['', [
    Validators.required,
    Validators.email,
    Validators.maxLength(100)
  ]],
  dateOfBirth: ['', [
    Validators.required,
    this.dateValidator
  ]],
  phoneNumber: ['', [
    Validators.required,
    Validators.pattern(/^[\+]?[0-9\s\-\(\)]{8,15}$/)
  ]],
  address: ['', [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(200)
  ]],
  enrollmentDate: ['', [Validators.required]],
  isActive: [true],
  parentId: ['', Validators.required],
  classroomId: ['', Validators.required],
});

  }

  ngOnInit(): void {
    console.log('✅ AddStudentComponent initialized');
    this.loadParents();
    this.loadClassrooms();
  }

  loadClassrooms(): void {
    console.log('📡 Loading classrooms...');
    this.loading = true;
    this.classormService.findAll().subscribe({
      next: (classrooms:any) => {
        console.log('✅ Classrooms loaded:', classrooms);
        this.classrooms = classrooms;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading classrooms:', error);
        this.loading = false;
      }
    });
  }

  loadParents(): void {
    console.log('📡 Loading parents...');
    this.loading = true;
    this.parentService.getParents().subscribe({
      next: (parents:any) => {
        console.log('✅ Parents loaded:', parents);
        this.parents = parents;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading parents:', error);
        this.loading = false;
      }
    });
  }

  dateValidator(control: any) {
    const today = new Date();
    const inputDate = new Date(control.value);
    return inputDate < today ? null : { futureDate: true };
  }

  onSubmit(): void {
    this.submitted = true;
    console.log('✅ Form submitted:', this.studentForm.value);
    if (!this.studentForm.valid) {
      console.error('❌ Form invalid');
      return;
    }
    this.loading = true;
    this.studentService.createStudent(this.studentForm.value).subscribe({
      next: (response) => {
        console.log('✅ Student created successfully:', response);
        this.loading = false;
        this.router.navigate(['/student']);
      },
      error: (error) => {
        console.error('❌ Error creating student:', error);
        this.loading = false;
      }
    });
  }

  get f() { return this.studentForm.controls; }

  goBack(): void {
    this.router.navigate(['/student']);
  }
}
