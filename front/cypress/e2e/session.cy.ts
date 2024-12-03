describe('Session spec', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      // Intercepte la requête POST pour le login
      cy.intercept('POST', '/api/auth/login', {
        body: users.adminUser, // Utilise les données du fichier JSON
      });

      // Interception des enseignants
      cy.fixture('teachers.json').then((teachers) => {
        cy.intercept('GET', '/api/teacher', {
          body: teachers, // Utilise les données du fichier JSON
        }).as('getTeachers');
      });

      // Interception des sessions
      cy.fixture('sessions.json').then((sessions) => {
        cy.intercept('GET', '/api/session', {
          body: sessions, // Utilise les données du fichier JSON
        }).as('getSessions');
      });

      // Interception de la première session
      cy.fixture('sessions.json').then((sessions) => {
        cy.intercept('GET', '/api/session/1', {
          body: sessions[0], // Utilise les données du fichier JSON
        }).as('getSession');
      });

      // Interception du deuxième enseignant
      cy.fixture('teachers.json').then((teachers) => {
        cy.intercept('GET', '/api/teacher/2', {
          body: teachers[1], // Utilise les données du fichier JSON
        }).as('getTeacher');
      });

      // Navigation vers la page de login et connexion
      cy.visit('/login');
      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type('test!1234');
      cy.get('button[type="submit"]').click(); // Soumettre le formulaire
    });
  });

  it('Should allow an admin user to create a session', () => {
    cy.get('button[routerLink="create"]').should('be.visible').click();
    cy.url().should('include', '/sessions/create');
    cy.get('h1').should('contain', 'Create session');

    cy.intercept('POST', '/api/session', {
      body: {
        id: 2,
        name: 'session 2',
        date: '2025-01-01',
        teacher_id: 1,
        description: 'my description',
        users: [],
        createdAt: '2024-11-26T20:27:19.005362715',
        updatedAt: '2024-11-26T20:27:19.024193944',
      },
    }).as('createSession');

    cy.get('input[formControlName=name]').type('session 2');
    cy.get('textarea[formControlName=description]').type('my description');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();
    cy.get('input[formControlName=date]').type('2025-01-01');
    cy.get('button[type="submit"]').click();

    cy.wait('@createSession').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.get('simple-snack-bar .mat-simple-snack-bar-content')
      .should('be.visible')
      .and('contain', 'Session created !');
    cy.url().should('include', '/sessions');
  });

  it('Should display session details', () => {
    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');

    cy.get('mat-card').first().within(() => {
      cy.contains('button', 'Detail').click();
    });

    cy.url().should('include', '/sessions/detail/1');
    cy.wait('@getSession').then((sessionInterception) => {
      cy.wait('@getTeacher').then((interception) => {
        const teacher = interception.response.body;
        const session = sessionInterception.response.body;

        cy.get('.description').should('contain', 'my description');
        cy.get('mat-card-subtitle').within(() => {
          cy.contains(`${teacher.firstName} ${teacher.lastName.toUpperCase()}`)
            .should('be.visible');
        });
        cy.get('.ml1').should('contain', `${session.users.length}`);
        cy.get('mat-icon').within(() => {
          cy.contains('delete').should('be.visible');
        });
      });
    });
  });

  it('Should allow an admin user to delete a session', () => {
    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');

    cy.get('mat-card').first().within(() => {
      cy.contains('button', 'Detail').click();
    });

    cy.url().should('include', '/sessions/detail/1');
    cy.wait('@getSession');
    cy.wait('@getTeacher');

    cy.intercept('DELETE', '/api/session/1', { statusCode: 200 }).as(
      'deleteSession'
    );

    cy.get('mat-icon').contains('delete').click();
    cy.wait('@deleteSession').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    cy.get('simple-snack-bar .mat-simple-snack-bar-content')
      .should('be.visible')
      .and('contain', 'Session deleted !');
    cy.url().should('include', '/sessions');
  });

  it('Should not show delete and edit buttons for non-admin users', () => {
    cy.fixture('users.json').then((users) => {
      cy.intercept('POST', '/api/auth/login', {
        body: users.randomUser,
      });
      cy.visit('/login');
      cy.get('input[formControlName=email]').type('daryl@mail.com');
      cy.get('input[formControlName=password]').type('test!1234');
      cy.get('button[type="submit"]').click();
    });

    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');

    cy.get('mat-card').first().within(() => {
      cy.contains('button', 'Edit').should('not.exist');
    });

    cy.get('button[routerLink="create"]').should('not.exist');
  });
});
