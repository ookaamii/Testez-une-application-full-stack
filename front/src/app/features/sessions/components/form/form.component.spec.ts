import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { ListComponent } from '../list/list.component';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: Router;
  let activatedRouteMock: any;
  let mockSessionApiService: any;
  let matSnackBarMock: any;

  // Mock de données de session pour les tests
  const mockSession = {
    id: 1,
    name: 'Session Test',
    description: 'Test session description',
    date: '2025-01-29',
    teacher_id: 1,
  };

  // Mock des informations utilisateur pour simuler un administrateur
  const mockSessionService = {
    sessionInformation: {
      admin: true, // Par défaut, l'utilisateur est administrateur
    },
  };

  beforeEach(async () => {
    // Création de mocks pour les services externes
    mockSessionApiService = {
      detail: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };

    matSnackBarMock = {
      open: jest.fn(), // Mock de MatSnackBar
    };

    // Mock de ActivatedRoute pour simuler les paramètres d'URL
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1'), // Simule un paramètre d'URL avec un ID de session
        },
      },
    };

    // Configuration du module de test avec les dépendances nécessaires
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: ListComponent },
          { path: 'sessions/update/:id', component: FormComponent },
        ]),
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: MatSnackBar, useValue: matSnackBarMock },
      ],
      declarations: [FormComponent],
    }).compileComponents();

    // Initialisation des instances pour les tests
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test : Vérifier que le composant se crée correctement
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test : Redirection si l'utilisateur n'est pas administrateur
  test('should redirect if the user is not admin', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    // Modifier l'état utilisateur pour qu'il ne soit pas admin
    mockSessionService.sessionInformation.admin = false;

    // Appel de la méthode ngOnInit
    component.ngOnInit();

    // Vérifier la redirection
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  // Test : Initialisation du formulaire d'update
  test('should load update form when url is update', () => {
    const spy = jest.spyOn(mockSessionApiService, 'detail');
    mockSessionApiService.detail.mockReturnValue(of(mockSession));

    // Simuler une URL contenant "update"
    Object.defineProperty(router, 'url', { value: '/sessions/update/1' });

    // Appel de la méthode ngOnInit
    component.ngOnInit();

    // Vérifier l'état et les valeurs du formulaire
    expect(component.onUpdate).toBe(true);
    expect(spy).toHaveBeenCalledWith('1');
    expect(component.sessionForm?.value).toEqual({
      name: 'Session Test',
      description: 'Test session description',
      date: '2025-01-29',
      teacher_id: 1,
    });
  });

  // Test : Création d'une session
  test('should create session when not update form', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const mockSessionRequest = {
      name: 'Session Test',
      description: 'Test session description',
      date: '2025-01-29',
      teacher_id: 1,
    };

    mockSessionApiService.create.mockReturnValue(of(mockSession));

    // Vérifier que sessionForm est initialisé
    if (!component.sessionForm) {
      throw new Error('sessionForm is undefined');
    }

    // Remplir le formulaire avec des données valides
    component.sessionForm.setValue(mockSessionRequest);

    // Appeler la méthode de soumission
    component.submit();

    // Vérifier les appels aux services et les effets attendus
    expect(mockSessionApiService.create).toHaveBeenCalledWith(mockSessionRequest);
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });
});
