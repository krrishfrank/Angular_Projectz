import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { of } from 'rxjs';

import { Character, Episode } from '../../../core/models/character';
import { ApiService } from '../../../core/services/api.service';
import { CharacterDetailsComponent } from './character-details.component';

describe('CharacterDetailsComponent', () => {
  let component: CharacterDetailsComponent;
  let fixture: ComponentFixture<CharacterDetailsComponent>;
  let mockApiService: jest.Mocked<Pick<ApiService, 'getCharacterById' | 'getMultipleEpisodes'>>;

  const mockCharacter: Character = {
    id: 42,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    image: 'rick.png',
    episode: ['https://rickandmortyapi.com/api/episode/1', 'https://rickandmortyapi.com/api/episode/2']
  };

  const mockEpisodes: Episode[] = [
    { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01' },
    { id: 2, name: 'Lawnmower Dog', air_date: 'December 9, 2013', episode: 'S01E02' }
  ];

  beforeEach(async () => {
    mockApiService = {
      getCharacterById: jest.fn<ApiService['getCharacterById']>().mockReturnValue(of(mockCharacter)),
      getMultipleEpisodes: jest.fn<ApiService['getMultipleEpisodes']>().mockReturnValue(of(mockEpisodes))
    };

    await TestBed.configureTestingModule({
      imports: [CharacterDetailsComponent, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '42');
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load the character and its episodes on initialization', () => {
    fixture.detectChanges();

    expect(mockApiService.getCharacterById).toHaveBeenCalledWith(42);
    expect(mockApiService.getMultipleEpisodes).toHaveBeenCalledWith(mockCharacter.episode);
    expect(component.character()).toEqual(mockCharacter);
    expect(component.episodes()).toEqual(mockEpisodes);
  });

  it('should show the character and episode details', () => {
    fixture.detectChanges();

    const renderedText = fixture.nativeElement.textContent;
    expect(renderedText).toContain('Rick Sanchez');
    expect(renderedText).toContain('Pilot');
    expect(renderedText).toContain('Lawnmower Dog');
    expect(renderedText).toContain('S01E01');
    expect(renderedText).toContain('S01E02');
  });

  it('should return all episodes when the filter is empty or whitespace', () => {
    component.episodes.set(mockEpisodes);

    expect(component.filteredEpisodes()).toEqual(mockEpisodes);

    component.filterText.set('   ');
    expect(component.filteredEpisodes()).toEqual(mockEpisodes);
  });

  it('should filter episodes by name without case sensitivity and surrounding whitespace', () => {
    component.episodes.set(mockEpisodes);
    component.filterText.set('  PILOT ');

    expect(component.filteredEpisodes()).toEqual([mockEpisodes[0]]);
  });

  it('should update the filter from the input event and show the empty state for no matches', () => {
    fixture.detectChanges();

    const filterInput: HTMLInputElement = fixture.nativeElement.querySelector('input');
    filterInput.value = 'No matching episode';
    filterInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.filterText()).toBe('No matching episode');
    expect(component.filteredEpisodes()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('No matching records');
  });
});
