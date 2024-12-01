import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
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
    sessionInformation: {
      admin: true,
      id: 1,
    },
    logOut: jest.fn(),
  };

  beforeEach(async () => {
    // Mock des services
    userServiceMock = {
      getById: jest.fn(() =>
        of({ id: 1, firstName: 'Admin', email: 'yoga@studio.com' }) // Retourne un observable
      ),
      delete: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    matSnackBarMock = {
      open: jest.fn(),
    };

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

  test("doit charger l'utilisateur avec l'ID depuis le service", () => {
    // Mock de la réponse pour getById
    const mockUser = { id: 1, firstName: 'Admin', email: 'yoga@studio.com' };
    userServiceMock.getById.mockReturnValue(of(mockUser));

    component.ngOnInit(); // Appelle ngOnInit pour simuler le chargement

    expect(userServiceMock.getById).toHaveBeenCalledWith('1'); // Vérifie que getById est appelé avec l'ID
    expect(component.user).toEqual(mockUser); // Vérifie que l'utilisateur est bien chargé
  });

  // Vérifie le comportement du bouton retour
  test('doit appeler window.history.back pour revenir en arrière', () => {
    const backSpy = jest.spyOn(window.history, 'back').mockImplementation(); // Espionne window.history.back

    component.back(); // Appelle la méthode back

    expect(backSpy).toHaveBeenCalled(); // Vérifie que window.history.back a été appelé

    backSpy.mockRestore(); // Restaure le comportement original de back
  });

  test('doit supprimer un utilisateur et retourner un message', () => {
    userServiceMock.delete.mockReturnValue(of(void 0));

    component.delete();

    expect(userServiceMock.delete).toHaveBeenCalledWith('1');
    expect(matSnackBarMock.open).toHaveBeenCalledWith(
      'Your account has been deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
