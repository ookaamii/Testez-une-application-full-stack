import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
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

  // Mock des services
  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  beforeEach(async () => {
    // Mock des services SessionApiService et MatSnackBar
    mockSessionApiService = {
      detail: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };

    matSnackBarMock = {
      open: jest.fn(),
    };

    // Création d'un mock pour ActivatedRoute
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1'), // Simulez l'id ici
        },
      },
    };

    // Configuration du module de test
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

    // Initialisation des instances
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test de la création du composant
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test : Redirection si l'utilisateur n'est pas administrateur
  test('should redirect if the user is not admin', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    // L'utilisateur n'est pas admin
    mockSessionService.sessionInformation.admin = false;

    // Appel de ngOnInit pour tester la redirection
    component.ngOnInit();

    // Vérifier que la redirection a eu lieu
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  // Test : Chargement du formulaire de mise à jour lorsque l'URL contient "update"
  test('should load update form when url is update', () => {
    const spy = jest.spyOn(mockSessionApiService, 'detail');

    const mockSession = {
      id: 1,
      name: 'Session Test',
      description: 'Test session description',
      date: '2025-01-29',
      users: [],
      teacher_id: 1,
    };
    mockSessionApiService.detail.mockReturnValue(of(mockSession));

    // Simule l'URL pour inclure "update"
    Object.defineProperty(router, 'url', { value: '/sessions/update/1' });

    // Appel de ngOnInit pour charger les données de la session
    component.ngOnInit();

    // Vérifier que le formulaire a bien été initialisé avec les données de la session
    expect(component.onUpdate).toBe(true);
    expect(spy).toHaveBeenCalledWith('1');
    expect(component.sessionForm?.value).toEqual({
      name: 'Session Test',
      description: 'Test session description',
      date: '2025-01-29',
      teacher_id: 1,
    });
  });

  // Test : Création d'une session lorsque le formulaire n'est pas pour la mise à jour
  test('should create session when not update form', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const mockSessionRequest = {
      name: 'Session Test',
      description: 'Test session description',
      date: '2025-01-29',
      teacher_id: 1,
    };
    const mockSession = {
      id: 1,
      name: 'Session Test',
      description: 'Test session description',
      date: '2025-01-29',
      teacher_id: 1,
    };
    mockSessionApiService.create.mockReturnValue(of(mockSession));

    // Vérifier que sessionForm existe
    if (!component.sessionForm) {
      throw new Error('sessionForm is undefined');
    }

    // Initialiser le formulaire avec des valeurs valides
    component.sessionForm.setValue(mockSessionRequest);

    // Appel de la méthode de soumission
    component.submit();

    // Vérifier que la méthode de création a été appelée avec les bonnes données
    expect(mockSessionApiService.create).toHaveBeenCalledWith(mockSessionRequest);

    // Vérifier que le snackBar a été ouvert avec le bon message
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });

    // Vérifier que la redirection a eu lieu
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });
});
