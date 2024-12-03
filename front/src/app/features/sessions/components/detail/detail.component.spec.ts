// Importation des modules nécessaires pour les tests
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { ListComponent } from '../list/list.component';
import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;
  let mockSessionApiService: any;
  let matSnackBarMock: any;
  let mockTeacherService: any;
  let router: Router;
  let activatedRouteMock: any;

  // Variables simulées pour tester les sessions et utilisateurs
  const mockSessionId = '1';
  const mockUserId = '1';

  // Mock de SessionService avec un utilisateur administrateur
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

  beforeEach(async () => {
    // Création de mocks pour les services utilisés
    mockSessionApiService = {
      delete: jest.fn(),
      detail: jest.fn(),
      participate: jest.fn(),
      unParticipate: jest.fn(),
    };

    matSnackBarMock = {
      open: jest.fn(),
    };

    // Configuration par défaut du service `detail` pour les sessions
    mockSessionApiService.detail.mockReturnValue(of({
      id: 1,
      name: 'Cours',
      description: 'Super cours',
      date: new Date(),
      users: [],
      teacher_id: 1,
    } as Session));

    // Mock pour le service `TeacherService`
    mockTeacherService = {
      detail: jest.fn(),
    };
    mockTeacherService.detail.mockReturnValue(of({
      id: 1,
      firstName: 'Margot',
      lastName: 'DELAHAYE',
    } as Teacher));

    // Création d'un mock pour `ActivatedRoute` avec un paramètre d'URL simulé
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1'), // Simule l'identifiant d'une session
        },
      },
    };

    // Configuration du module de test Angular
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: ListComponent },
        ]),
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: matSnackBarMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    // Initialisation des instances nécessaires au test
    router = TestBed.inject(Router);
    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test de création du composant
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test pour vérifier si `back()` appelle `window.history.back`
  test('doit appeler window.history.back quand back() est cliqué', () => {
    const backSpy = jest.spyOn(window.history, 'back').mockImplementation(() => {});

    component.back();

    expect(backSpy).toHaveBeenCalled();

    backSpy.mockRestore();
  });

  // Test pour la suppression d'une session
  test('doit supprimer une session et rediriger vers la liste avec un message de confirmation', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Simule la réponse du service `delete`
    mockSessionApiService.delete.mockReturnValue(of(void 0));

    // Appelle la méthode de suppression
    component.delete();

    // Vérifie si les services ont été appelés avec les bons arguments
    expect(mockSessionApiService.delete).toHaveBeenCalledWith(mockSessionId);
    expect(matSnackBarMock.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 },
    );
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  // Test pour l'ajout d'un utilisateur à une session
  test('doit ajouter un utilisateur à une session et mettre à jour les informations', () => {
    // Simule les réponses des appels API
    mockSessionApiService.participate.mockReturnValue(of(void 0));
    mockSessionApiService.detail.mockReturnValue(of({
      id: 1,
      name: 'Session Test',
      description: 'Test session description',
      date: new Date(),
      users: [1],
      teacher_id: 1,
    } as Session));
    mockTeacherService.detail.mockReturnValue(of({
      id: 1,
      firstName: 'Margot',
      lastName: 'DELAHAYE',
    } as Teacher));

    // Configuration initiale des identifiants session et utilisateur
    component.sessionId = mockSessionId;
    component.userId = mockUserId;

    // Appel de la méthode `participate`
    component.participate();

    // Vérification des appels et de la mise à jour de l'état du composant
    expect(mockSessionApiService.participate).toHaveBeenCalledWith(mockSessionId, mockUserId);
    expect(mockSessionApiService.detail).toHaveBeenCalled();
    expect(mockTeacherService.detail).toHaveBeenCalled();
    expect(component.teacher).toEqual({
      id: 1,
      firstName: 'Margot',
      lastName: 'DELAHAYE',
    });
    expect(component.session).toBeDefined();
    expect(component.isParticipate).toBe(true);
  });

  // Test pour la suppression d'un utilisateur d'une session
  test('doit supprimer un utilisateur d’une session', () => {
    // Simule les réponses des appels API
    mockSessionApiService.unParticipate.mockReturnValue(of(void 0));
    mockSessionApiService.detail.mockReturnValue(of({
      id: 1,
      name: 'Session Test',
      description: 'Test session description',
      date: new Date(),
      users: [],
      teacher_id: 1,
    } as Session));
    mockTeacherService.detail.mockReturnValue(of({
      id: 1,
      firstName: 'Margot',
      lastName: 'DELAHAYE',
    } as Teacher));

    // Configuration initiale des identifiants session et utilisateur
    component.sessionId = mockSessionId;
    component.userId = mockUserId;

    // Appel de la méthode `unParticipate`
    component.unParticipate();

    // Vérification des appels et de la mise à jour de l'état du composant
    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith(mockSessionId, mockUserId);
    expect(mockSessionApiService.detail).toHaveBeenCalled();
    expect(component.teacher).toEqual({
      id: 1,
      firstName: 'Margot',
      lastName: 'DELAHAYE',
    });
    expect(component.session).toBeDefined();
  });
});
