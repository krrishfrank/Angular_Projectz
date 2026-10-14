import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Character, Episode } from '../../../core/models/character';

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './character-details.component.html',
})
export class CharacterDetailsComponent implements OnInit {

  private apiService = inject(ApiService);
  id = input.required<string>();
  
  character = signal<Character | null>(null);
  episodes = signal<Episode[]>([]);
  filterText = signal<string>('');

  filteredEpisodes = computed(() => {
    const term = this.filterText().toLowerCase().trim();
    if (!term) return this.episodes();
    return this.episodes().filter(ep => ep.name.toLowerCase().includes(term));
  });

  ngOnInit(): void {
    const characterId = Number(this.id());
    this.apiService.getCharacterById(characterId).subscribe(char => {
      this.character.set(char);
      
      this.apiService.getMultipleEpisodes(char.episode).subscribe(eps => {
        this.episodes.set(eps);
      });
    });
  }

  onFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterText.set(input.value);
  }
}
