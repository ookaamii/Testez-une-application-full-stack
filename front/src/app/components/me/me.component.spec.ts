import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';

import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userServiceMock: any;
  let routerMock: any;
  let matSnackBarMock: any;

  const mockSessionService = {
    sessionInformation: { admin: true, id: 1 },
    logOut: jest.fn(),
  };

  beforeEach(async () => {
    // Mock des services pour les tests
    userServiceMock = {
      getById: jest.fn(() =>
        of({ id: 1, firstName: 'Admin', email: 'yoga@studio.com' })
      ),
      delete: jest.fn(),
    };

    routerMock = { navigate: jest.fn() };
    matSnackBarMock = { open: jest.fn() };

    // Configuration du TestBed
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: matSnackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should load user data when initialized', () => {
    const mockUser = { id: 1, firstName: 'Admin', email: 'yoga@studio.com' };
    userServiceMock.getById.mockReturnValue(of(mockUser));

    component.ngOnInit(); // Appel de ngOnInit pour charger l'utilisateur

    // Vérifie que le service getById a été appelé avec l'ID '1'
    expect(userServiceMock.getById).toHaveBeenCalledWith('1');
    // Vérifie que l'utilisateur chargé est égal à mockUser
    expect(component.user).toEqual(mockUser);
  });

  // Test du bouton retour
  test('should navigate back on back button click', () => {
    const backSpy = jest.spyOn(window.history, 'back').mockImplementation(); // Espionner l'appel de history.back

    component.back(); // Appel de la méthode back pour revenir en arrière

    expect(backSpy).toHaveBeenCalled(); // Vérifie que back a bien été appelé

    backSpy.mockRestore(); // Restaure le comportement original de back
  });

  // Test de suppression d'un utilisateur
  test('should delete user and show success message', () => {
    userServiceMock.delete.mockReturnValue(of(void 0)); // Mock la réponse de suppression de l'utilisateur

    component.delete(); // Appel de la méthode delete

    // Vérifie que la méthode delete a été appelée avec l'ID '1'
    expect(userServiceMock.delete).toHaveBeenCalledWith('1');
    // Vérifie que MatSnackBar a bien affiché un message de succès
    expect(matSnackBarMock.open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );
    // Vérifie que la méthode logOut du service sessionService a été appelée
    expect(mockSessionService.logOut).toHaveBeenCalled();
    // Vérifie que la redirection a bien eu lieu
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  afterEach(() => {
    // Restaure les espions après chaque test
    jest.restoreAllMocks();
  });
});
