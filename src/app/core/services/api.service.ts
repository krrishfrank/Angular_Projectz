import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Character, Episode } from '../models/character';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://rickandmortyapi.com/api';

  getCharacters(name: string = '', page: number = 1): Observable<{ results: Character[], info: any }> {
    let url = `${this.baseUrl}/character?page=${page}`;
    if (name) {
      url += `&name=${encodeURIComponent(name)}`;
    }
    return this.http.get<{ results: Character[], info: any }>(url);
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.baseUrl}/character/${id}`);
  }

  getMultipleEpisodes(episodeUrls: string[]): Observable<Episode[]> {
    if (!episodeUrls || episodeUrls.length === 0) return new Observable(sub => sub.next([]));
    
    const ids = episodeUrls.map(url => url.split('/').pop()).join(',');
    
    return this.http.get<Episode | Episode[]>(`${this.baseUrl}/episode/${ids}`).pipe(
      map(response => Array.isArray(response) ? response : [response])
    );
  }
}
