import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { CharacterListComponent } from './character-list.component';
import { Character } from '../../../core/models/character';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { of, throwError } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

describe('CharacterListComponent', () => {
  let component: CharacterListComponent;
  let fixture: ComponentFixture<CharacterListComponent>;
  
  let mockApiService: jest.Mocked<Pick<ApiService, 'getCharacters'>>;
  let mockRouter: jest.Mocked<Partial<Router>>;
  let mockAuthService: jest.Mocked<Partial<AuthService>>;

  
  const mockCharacters: Character[] = [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: ['https://rickandmortyapi.com/api/episode/1', 'https://rickandmortyapi.com/api/episode/2']
    },
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
      episode: ['https://rickandmortyapi.com/api/episode/2']
    }
  ];

  beforeEach(async () => {
    mockApiService = {
      getCharacters: jest
        .fn<ApiService['getCharacters']>()
        .mockReturnValue(of({ results: mockCharacters, info: {} }))
    };
    mockRouter = {
      navigate: jest.fn<Router['navigate']>()
    };
    mockAuthService = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    });
    await TestBed.configureTestingModule({
      imports: [CharacterListComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterListComponent);
    component = fixture.componentInstance;
    jest.clearAllMocks();
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization (ngOnInit)', () => {
    it('should set viewMode from localStorage if a valid value exists', () => {
      jest.spyOn(window.localStorage, 'getItem').mockReturnValue('list');
      
      component.ngOnInit();
      
      expect(component.viewMode()).toBe('list');
    });

    it('should keep default viewMode (grid) if localStorage is empty', () => {
      jest.spyOn(window.localStorage, 'getItem').mockReturnValue(null);
      
      component.ngOnInit();
      
      expect(component.viewMode()).toBe('grid');
    });

    it('should ignore invalid localStorage values for viewMode', () => {
      jest.spyOn(window.localStorage, 'getItem').mockReturnValue('invalid');

      component.ngOnInit();

      expect(component.viewMode()).toBe('grid');
    });
  });

  describe('Character Loading (Signals & Effects)', () => {
    it('should update characters signal on successful API response', () => {
      component.searchQuery.set('Rick');
      component.currentPage.set(2);
      
      fixture.detectChanges(); 

      expect(mockApiService.getCharacters).toHaveBeenCalledWith('Rick', 2);
      expect(component.characters()).toEqual(mockCharacters);
      expect(component.errorMessage()).toBe('');
    });

    it('should set error message signal when API fails', () => {
      mockApiService.getCharacters.mockReturnValue(throwError(() => new Error('API Error')));
      
      component.loadCharacters('Unknown', 1);

      expect(component.characters()).toEqual([]);
      expect(component.errorMessage()).toBe('No characters found matching selection parameters.');
    });

  });

  describe('User Interactions', () => {
    it('should update searchQuery signal and reset currentPage to 1 on search input event', () => {
      const mockEvent = {
        target: { value: 'Morty' }
      } as unknown as Event;

      component.onSearch(mockEvent);

      expect(component.searchQuery()).toBe('Morty');
      expect(component.currentPage()).toBe(1);
    });

    it('should update viewMode signal and update localStorage when toggleView is called', () => {
      const setItemSpy = jest.spyOn(window.localStorage, 'setItem');
      
      component.toggleView('list');

      expect(component.viewMode()).toBe('list');
      expect(setItemSpy).toHaveBeenCalledWith('viewMode', 'list');
    });

    it('should navigate to the character detail page when navigateToDetail is triggered', () => {
      component.navigateToDetail(5);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/characters', 5]);
    });
  });
});
