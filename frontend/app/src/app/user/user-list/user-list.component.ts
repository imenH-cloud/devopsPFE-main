import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  standalone: false  // AJOUTEZ CETTE LIGNE
})
export class ListUserComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUsers: number[] = [];
  searchTerm = '';
  statusFilter = '';
  loading = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.firstName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || 
        user.active.toString() === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedUsers = this.filteredUsers.map(user => user.id);
    } else {
      this.selectedUsers = [];
    }
  }

  toggleUserSelection(userId: number, event: any): void {
    if (event.target.checked) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/users/add']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  deleteSelected(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedUsers.length} selected users?`)) {
      this.userService.deleteMultipleUsers(this.selectedUsers).subscribe({
        next: () => {
          this.selectedUsers = [];
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting users:', error);
        }
      });
    }
  }
}