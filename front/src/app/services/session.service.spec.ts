import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  const mockUser = {
      id: 1,
      username: 'yoga@studio.com',
      token: '123',
      firstName: 'Admin',
      lastName: 'Admin',
      type: 'test',
      admin: true
    };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  test('doit être créé', () => {
      expect(service).toBeTruthy();
    });

    test('doit retourner false après une déconnexion', (done) => {
      service.logOut();
      service.$isLogged().subscribe((value) => {
        expect(value).toBeFalsy();
        done(); // pour les tests asynchrones
      });
    });

    test('doit retourner true après une connexion', (done) => {
      // Simuler une connexion
      service.logIn(mockUser);
      service.$isLogged().subscribe((value) => {
        expect(value).toBeTruthy();
        done();
      });
    });

});
