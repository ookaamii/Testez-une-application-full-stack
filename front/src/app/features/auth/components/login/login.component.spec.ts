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

  beforeEach(async () => {
    // Mock des services
    authServiceMock = {
      login: jest.fn(),
    };
    sessionServiceMock = {
      logIn: jest.fn(),
    };
    routerMock = {
      navigate: jest.fn(),
    };

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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('doit envoyer les données de connexion et rediriger en cas de succès', () => {
    // Données de simulation
    const mockLoginRequest = { email: 'yoga@studio.com', password: 'test!1234' };
    const mockSessionInfo: SessionInformation = {
      id: 1,
      username: 'yoga@studio.com',
      token: '123',
      firstName: 'Admin',
      lastName: 'Admin',
      type: 'test',
      admin: true,
    };

    // Configure le mock du service d'authentification
    authServiceMock.login.mockReturnValue(of(mockSessionInfo));

    // Remplit le formulaire
    component.form.setValue(mockLoginRequest);

    // Appelle la méthode submit
    component.submit();

    // Vérifie que le service a été appelé avec les bonnes données
    expect(authServiceMock.login).toHaveBeenCalledWith(mockLoginRequest);

    // Vérifie que sessionService.logIn a été appelé avec la réponse
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(mockSessionInfo);

    // Vérifie que la redirection a été effectuée
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  test('doit afficher une erreur en cas d’échec de connexion', () => {
    // Données de simulation
    const mockLoginRequest = { email: 'test@test.com', password: 'wrongPassword' };

    // Configure le mock du service d'authentification pour renvoyer une erreur
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Login failed')));

    // Remplit le formulaire
    component.form.setValue(mockLoginRequest);

    // Appelle la méthode submit
    component.submit();

    // Vérifie que le service a été appelé
    expect(authServiceMock.login).toHaveBeenCalledWith(mockLoginRequest);

    // Vérifie que la variable onError a été mise à jour
    expect(component.onError).toBe(true);

    // Vérifie que la redirection n'a pas été effectuée
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
