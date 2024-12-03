import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let sessionServiceMock: any;
  let routerMock: any;

  // Mock de la session utilisateur
  const mockSessionInfo: SessionInformation = {
    id: 1,
    username: 'yoga@studio.com',
    token: '123',
    firstName: 'Admin',
    lastName: 'Admin',
    type: 'test',
    admin: true,
  };

  beforeEach(async () => {
    // Mock des services nécessaires pour les tests
    authServiceMock = {
      login: jest.fn(),
    };
    sessionServiceMock = {
      logIn: jest.fn(),
    };
    routerMock = {
      navigate: jest.fn(),
    };

    // Configuration du TestBed
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    // Création du composant
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test de création du composant
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test pour vérifier l'envoi des données de connexion et la redirection en cas de succès
  test('doit envoyer les données de connexion et rediriger en cas de succès', () => {
    // Données de simulation pour la connexion
    const mockLoginRequest = { email: 'yoga@studio.com', password: 'test!1234' };

    // Mock du service d'authentification pour renvoyer une session valide
    authServiceMock.login.mockReturnValue(of(mockSessionInfo));

    // Remplissage du formulaire avec les données simulées
    component.form.setValue(mockLoginRequest);

    // Soumission du formulaire
    component.submit();

    // Vérifie que le service login a été appelé avec les bonnes données
    expect(authServiceMock.login).toHaveBeenCalledWith(mockLoginRequest);

    // Vérifie que sessionService.logIn a été appelé avec les informations de session retournées
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(mockSessionInfo);

    // Vérifie que la redirection a bien eu lieu
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  // Test pour vérifier l'affichage de l'erreur en cas d'échec de connexion
  test('doit afficher une erreur en cas d’échec de connexion', () => {
    // Données de simulation pour une connexion incorrecte
    const mockLoginRequest = { email: 'test@test.com', password: 'wrongPassword' };

    // Mock du service d'authentification pour renvoyer une erreur
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Login failed')));

    // Remplissage du formulaire avec des données incorrectes
    component.form.setValue(mockLoginRequest);

    // Soumission du formulaire
    component.submit();

    // Vérifie que le service login a bien été appelé avec les mauvaises données
    expect(authServiceMock.login).toHaveBeenCalledWith(mockLoginRequest);

    // Vérifie que la variable onError a été mise à jour pour signaler une erreur
    expect(component.onError).toBe(true);

    // Vérifie que la redirection n'a pas été effectuée
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
