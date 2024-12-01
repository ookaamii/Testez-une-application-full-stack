import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { User } from '../interfaces/user.interface';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let pathService: 'api/user/';
  let id: '1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('doit supprimer un user', () => {
      // Appel du service
      service.delete(id).subscribe((response) => {
        expect(response).toBeNull(); // Vérifie que la réponse est correcte
      });

      // Vérifie l'URL et la méthode de la requête
      const req = httpMock.expectOne(pathService + id);
      expect(req.request.method).toBe('DELETE');

      // Simule une réponse de l'API
      req.flush(null);
    });
});
