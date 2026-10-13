import { Injectable, signal } from '@angular/core';

export type UserRole = 'Admin' | 'Viewer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentRoleSignal = signal<UserRole>('Admin');
  
  currentRole = this.currentRoleSignal.asReadonly();

  setRole(role: UserRole) {
    this.currentRoleSignal.set(role);
  }

  isAdmin(): boolean {
    return this.currentRoleSignal() === 'Admin';
  }
}
