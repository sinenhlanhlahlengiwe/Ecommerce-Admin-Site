import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  avatarUrl?: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pages: number[] = [];

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // Mock data for demonstration
    this.users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', isActive: true },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', isActive: true },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', isActive: false }
    ];
    this.updateFilteredUsers();
    this.loading = false;
  }

  updateFilteredUsers(): void {
    let filtered = this.users;
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = this.users.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    }
    
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredUsers = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updateFilteredUsers();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredUsers();
    }
  }

  onEdit(user: User): void {
    console.log('Edit user:', user);
    // TODO: Implement edit functionality
  }

  onDelete(user: User): void {
    console.log('Delete user:', user);
    // TODO: Implement delete functionality
  }
}