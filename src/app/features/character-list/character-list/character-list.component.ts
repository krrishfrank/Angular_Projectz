import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Character } from '../../../core/models/character';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss'
})
export class CharacterListComponent implements OnInit{
  private apiService = inject(ApiService);
  private router = inject(Router);
  public authService = inject(AuthService);

  characters = signal<Character[]>([]);
  searchQuery = signal<string>('');
  currentPage = signal<number>(1);
  viewMode = signal<'grid' | 'list'>('grid');
  errorMessage = signal<string>('');
  private platformId = inject(PLATFORM_ID);
  constructor() {
    effect(() => {
      this.loadCharacters(this.searchQuery(), this.currentPage());
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedMode = localStorage.getItem('viewMode');
      if (savedMode === 'list' || savedMode === 'grid') {
        this.viewMode.set(savedMode);
      }
    }
  }

  loadCharacters(name: string, page: number): void {
    this.apiService.getCharacters(name, page).subscribe({
      next: (res) => {
        this.characters.set(res.results);
        this.errorMessage.set('');
      },
      error: () => {
        this.characters.set([]);
        this.errorMessage.set('No characters found matching selection parameters.');
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
  }

  toggleView(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
    localStorage.setItem('viewMode', mode);
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/characters', id]);
  }
}
