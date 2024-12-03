import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Teacher } from '../interfaces/teacher.interface';

import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;
  const pathService = 'api/teacher/';
  const id = '1';
  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Dixon',
    firstName: 'Daryl',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('doit retourner un professeur par son id', (done) => {
    // Appel du service
    service.detail('1').subscribe((teacher) => {
      expect(teacher).toEqual(mockTeacher); // Vérifie que la réponse est correcte
      done();
    });

    // Vérifie l'URL et la méthode de la requête
    const req = httpMock.expectOne(pathService + id);
    expect(req.request.method).toBe('GET');

    // Simule une réponse HTTP avec les données
    req.flush(mockTeacher);
  });
});
