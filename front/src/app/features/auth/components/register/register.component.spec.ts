import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { AuthService } from 'src/app/features/auth/services/auth.service';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Mock des services
    authServiceMock = {
      register: jest.fn(),
    };
    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('doit envoyer les données de connexion et rediriger en cas de succès', () => {
    // Données de simulation
    const mockRegisterRequest = { email: 'daryl@mail.com', firstName: 'Daryl', lastName: 'Dixon', password: 'daryl' };

    // Configure le mock du service pour renvoyer un Observable de succès
    authServiceMock.register.mockReturnValue(of(void 0));

    // Remplit le formulaire
    component.form.setValue(mockRegisterRequest);

    // Appelle la méthode submit
    component.submit();

    // Vérifie que le service a été appelé avec les bonnes données
    expect(authServiceMock.register).toHaveBeenCalledWith(mockRegisterRequest);

    // Vérifie que la redirection a été effectuée
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  test('ne doit pas soumettre le formulaire si les champs sont invalides', () => {
    // Données de simulation
    const mockRegisterRequest = { email: 'daryl@mail.com', firstName: 'Daryl', lastName: 'Dixon', password: 'd' };

    // Configure le mock du service d'authentification pour renvoyer une erreur
    authServiceMock.register.mockReturnValue(throwError(() => new Error('Register failed')));

    // Remplit le formulaire
    component.form.setValue(mockRegisterRequest);

    // Appelle la méthode submit
    component.submit();

    // Vérifie que le service a été appelé
    expect(authServiceMock.register).toHaveBeenCalledWith(mockRegisterRequest);

    // Vérifie que la variable onError a été mise à jour
    expect(component.onError).toBe(true);

    // Vérifie que la redirection n'a pas été effectuée
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
