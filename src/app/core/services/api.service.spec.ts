/// <reference types="jasmine" />

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Character, Episode } from '../models/character';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request characters from the API with default page when no page is provided', () => {
    const mockResponse = {
      info: { count: 2 },
      results: [{ id: 1, name: 'Rick Sanchez', status: 'Alive', species: 'Human', gender: 'Male', image: 'rick.png', episode: ['https://rickandmortyapi.com/api/episode/1'] } as Character]
    };

    service.getCharacters().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character?page=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should include the name query parameter when filtering characters by name', () => {
    const mockResponse = {
      info: { count: 1 },
      results: [{ id: 2, name: 'Morty Smith', status: 'Alive', species: 'Human', gender: 'Male', image: 'morty.png', episode: ['https://rickandmortyapi.com/api/episode/2'] } as Character]
    };

    service.getCharacters('Morty Smith').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character?page=1&name=Morty%20Smith');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch a single character by id', () => {
    const mockCharacter: Character = {
      id: 42,
      name: 'Bird Person',
      status: 'Alive',
      species: 'Bird-Person',
      gender: 'Male',
      image: 'birdperson.png',
      episode: ['https://rickandmortyapi.com/api/episode/11']
    };

    service.getCharacterById(42).subscribe(character => {
      expect(character).toEqual(mockCharacter);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/character/42');
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacter);
  });

  it('should return an empty array when no episode urls are provided', () => {
    service.getMultipleEpisodes([]).subscribe(episodes => {
      expect(episodes).toEqual([]);
    });

    httpMock.expectNone('https://rickandmortyapi.com/api/episode/');
  });

  it('should fetch multiple episodes by id and return them as an array', () => {
    const episodeUrls = [
      'https://rickandmortyapi.com/api/episode/1',
      'https://rickandmortyapi.com/api/episode/2'
    ];
    const mockEpisodes: Episode[] = [
      { id: 1, name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01' },
      { id: 2, name: 'Lawnmower Dog', air_date: 'December 9, 2013', episode: 'S01E02' }
    ];

    service.getMultipleEpisodes(episodeUrls).subscribe(episodes => {
      expect(episodes).toEqual(mockEpisodes);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode/1,2');
    expect(req.request.method).toBe('GET');
    req.flush(mockEpisodes);
  });

  it('should wrap a single episode response in an array', () => {
    const mockEpisode: Episode = {
      id: 3,
      name: 'Anatomy Park',
      air_date: 'December 16, 2013',
      episode: 'S01E03'
    };

    service.getMultipleEpisodes(['https://rickandmortyapi.com/api/episode/3']).subscribe(episodes => {
      expect(episodes).toEqual([mockEpisode]);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode/3');
    expect(req.request.method).toBe('GET');
    req.flush(mockEpisode);
  });
});
