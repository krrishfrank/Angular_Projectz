import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to admin role', () => {
    expect(service.currentRole()).toBe('Admin');
    expect(service.isAdmin()).toBe(true);
  });

  it('should update the role when setRole is called', () => {
    service.setRole('Viewer');

    expect(service.currentRole()).toBe('Viewer');
    expect(service.isAdmin()).toBe(false);
  });

  it('should allow switching back to admin role', () => {
    service.setRole('Viewer');
    service.setRole('Admin');

    expect(service.currentRole()).toBe('Admin');
    expect(service.isAdmin()).toBe(true);
  });
});
