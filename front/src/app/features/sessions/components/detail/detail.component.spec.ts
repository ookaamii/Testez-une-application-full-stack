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

  const mockSessionId = '1';
  const mockUserId = '1';

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  };

  beforeEach(async () => {
    // Mock des services
    mockSessionApiService = {
      delete: jest.fn(),
      detail: jest.fn(),
      participate: jest.fn(),
      unParticipate: jest.fn(),
    };

    matSnackBarMock = {
      open: jest.fn(),
    };

    mockSessionApiService.detail.mockReturnValue(of({
      id: 1,
      name: 'Cours',
      description: 'Super cours',
      date: new Date(),
      users: [],
      teacher_id: 1
    } as Session));

    mockTeacherService = {
      detail: jest.fn()
    };

    mockTeacherService.detail.mockReturnValue(of({
      id: 1,
      firstName: 'Margot',
      lastName: 'DELAHAYE'
    } as Teacher));

    // Création d'un mock pour ActivatedRoute
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1') // Simulez l'id ici
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: ListComponent }
        ]),
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: matSnackBarMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call window.history.back when back() is invoked', () => {
    const backSpy = jest.spyOn(window.history, 'back').mockImplementation(() => {});

    component.back();

    expect(backSpy).toHaveBeenCalled();

    backSpy.mockRestore();
  });

  test('doit supprimer un utilisateur et retourner un message', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    mockSessionApiService.delete.mockReturnValue(of(void 0));

    component.delete();

    expect(mockSessionApiService.delete).toHaveBeenCalledWith(mockSessionId);
    expect(matSnackBarMock.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(navigateSpy).toHaveBeenCalledWith(['sessions']);
  });

  test('doit ajouter un utilisateur à une session', () => {
    const participateSpy = jest.spyOn(mockSessionApiService, 'participate').mockReturnValue(of(void 0));
    const detailSpy = jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of({
      id: 1,
      name: 'Session Test',
      description: 'Test session description',
      date: new Date(),
      users: [1],
      teacher_id: 1
    } as Session));
    const getTeacherSpy = jest.spyOn(mockTeacherService, 'detail').mockReturnValue(of({
      id: 1,
      firstName: 'Margot',
      lastName: 'DELAHAYE'
    } as Teacher));

    component.sessionId = mockSessionId;
    component.userId = mockUserId;

    component.participate();

    expect(participateSpy).toHaveBeenCalledWith(mockSessionId, mockUserId);
    expect(detailSpy).toHaveBeenCalled();
    expect(component.teacher).toEqual({
      id: 1,
      firstName: 'Margot',
      lastName: 'DELAHAYE'
    });
    expect(component.session).toBeDefined();
    expect(component.isParticipate).toBe(true);
  });

  test('doit supprimer un utilisateur à une session', () => {
    const unParticipateSpy = jest.spyOn(mockSessionApiService, 'unParticipate').mockReturnValue(of(void 0));
    const detailSpy = jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of({
      id: 1,
      name: 'Session Test',
      description: 'Test session description',
      date: new Date(),
      users: [],
      teacher_id: 1
    } as Session));
    const getTeacherSpy = jest.spyOn(mockTeacherService, 'detail').mockReturnValue(of({
      id: 1,
      firstName: 'Margot',
      lastName: 'DELAHAYE'
    } as Teacher));

    component.sessionId = mockSessionId;
    component.userId = mockUserId;

    component.unParticipate();

    expect(unParticipateSpy).toHaveBeenCalledWith(mockSessionId, mockUserId);
    expect(detailSpy).toHaveBeenCalled();
    expect(component.teacher).toEqual({
      id: 1,
      firstName: 'Margot',
      lastName: 'DELAHAYE'
    });
    expect(component.session).toBeDefined();
  });
});
