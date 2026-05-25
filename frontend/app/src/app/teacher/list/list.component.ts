import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from '../teacher.service';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit, AfterViewInit {
  teachers: any[] = [];
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  ngAfterViewInit(): void {
    // Recharge après navigation
    setTimeout(() => this.loadTeachers(), 100);
  }

  loadTeachers(): void {
    this.loading = true;
    this.teacherService.getAll().subscribe({
      next: (data: any) => {
        this.teachers = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des enseignants:', err);
        this.error = 'Impossible de charger les enseignants';
        this.loading = false;
      }
    });
  }

  add(): void {
    this.router.navigate(['/teacher/add']);
  }

  edit(id: number): void {
    this.router.navigate(['/teacher/update', id]);
  }

  delete(id: number): void {
    // Pour la soutenance
  }
}
