import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;
  const pathService = 'api/session/';
  const pathServiceCreate = 'api/session';
  const id = '1';
  const userId = '1';
  const mockSession = {
    id: 1,
    name: 'Pilate',
    description: 'Cours de pilate de 45min',
    date: new Date(),
    teacher_id: 1,
    users: [1],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('doit supprimer une session', () => {
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

  test('doit afficher les détails d\'une session', () => {
    // Appel du service
    service.detail(id).subscribe((response) => {
      expect(response).toEqual(mockSession); // Vérifie que la réponse correspond
    });

    // Vérifie l'URL et la méthode de la requête
    const req = httpMock.expectOne(pathService + id);
    expect(req.request.method).toBe('GET');

    // Simule une réponse avec la session créée
    req.flush(mockSession);
  });

  test('doit créer une session', () => {
    // Appel du service
    service.create(mockSession).subscribe((response) => {
      expect(response).toEqual(mockSession); // Vérifie que la réponse correspond
    });

    // Vérifie l'URL et la méthode de la requête
    const req = httpMock.expectOne(pathServiceCreate);
    expect(req.request.method).toBe('POST');

    // Simule une réponse avec la session créée
    req.flush(mockSession);
  });

  test('doit modifier une session', () => {
    // Appel du service
    service.update(id, mockSession).subscribe((response) => {
      expect(response).toEqual(mockSession); // Vérifie que la réponse est correcte
    });

    // Vérifie l'URL et la méthode de la requête
    const req = httpMock.expectOne(pathService + id);
    expect(req.request.method).toBe('PUT');

    // Simule une réponse de l'API
    req.flush(mockSession);
  });

  test('doit faire participer un user à une session', () => {
    // Appel du service
    service.participate(id, userId).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    // Vérifie l'URL et la méthode de la requête
    const req = httpMock.expectOne(pathService + id + '/participate/' + userId);
    expect(req.request.method).toBe('POST');

    // Simule une réponse de l'API
    req.flush(null);
  });

  test('doit annuler la participation d’un user à une session', () => {
    // Appel du service
    service.unParticipate(id, userId).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    // Vérifie l'URL et la méthode de la requête
    const req = httpMock.expectOne(pathService + id + '/participate/' + userId);
    expect(req.request.method).toBe('DELETE');

    // Simule une réponse de l'API
    req.flush(null);
  });
});
