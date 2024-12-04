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

      // Navigation vers la page de login
      cy.visit('/login');
      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type('test!1234');
      cy.get('button[type="submit"]').click(); // Soumettre le formulaire
    });
  });

  it('Should allow an admin user to create a session', () => {
    // Cliquer sur le bouton de création
    cy.get('button[routerLink="create"]').should('be.visible').click();

    cy.url().should('include', '/sessions/create');

    // Vérifier le bon H1 pour la création d'une session
    cy.get('h1').should('contain', 'Create session');

    // Intercepter la requête POST pour la création
    cy.fixture('sessions.json').then((sessions) => {
      cy.intercept('POST', '/api/session', {
        body: sessions[1], // Utilise les données du fichier JSON
      }).as('createSession');
    });

    // Remplir le formulaire
    cy.get('input[formControlName=name]').type('session 2');
    cy.get('textarea[formControlName=description]').type('my description');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('Margot DELAHAYE').click();
    cy.get('input[formControlName=date]').type('2025-01-01');
    cy.get('button[type="submit"]').click();

    // Vérifier que la requête POST a été envoyée
    cy.wait('@createSession').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // Vérifier que le snackbar de succès s'affiche
    cy.get('simple-snack-bar .mat-simple-snack-bar-content')
      .should('be.visible')
      .and('contain', 'Session created !');
    cy.url().should('include', '/sessions');
  });

  it('Should display session details', () => {
    cy.url().should('include', '/sessions');
    // Attendre le chargement des données des sessions
    cy.wait('@getSessions');

    // Cliquer sur le bouton de detail
    cy.get('mat-card').first().within(() => {
      cy.contains('button', 'Detail').click();
    });

    cy.url().should('include', '/sessions/detail/1');

    // Attendre le chargement des données de la session et du professeur
    cy.wait('@getSession').then((sessionInterception) => {
      cy.wait('@getTeacher').then((interception) => {
        const teacher = interception.response.body;
        const session = sessionInterception.response.body;

        // Vérifier que les données affichées soient correctes
        cy.get('.description').should('contain', 'my description');
        cy.get('mat-card-subtitle').within(() => {
          cy.contains(`${teacher.firstName} ${teacher.lastName.toUpperCase()}`)
            .should('be.visible');
        });
        cy.get('.ml1').should('contain', `${session.users.length}`);
        // Vérifier que le bouton delete soit affiché car l'user connecté est un admin
        cy.get('mat-icon').within(() => {
          cy.contains('delete').should('be.visible');
        });
      });
    });
  });

  it('Should allow an admin user to delete a session', () => {
    cy.url().should('include', '/sessions');
    // Attendre le chargement des données des sessions
    cy.wait('@getSessions');

    // Cliquer sur le bouton de detail
    cy.get('mat-card').first().within(() => {
      cy.contains('button', 'Detail').click();
    });

    cy.url().should('include', '/sessions/detail/1');

    // Attendre le chargement des données de la session et du professeur
    cy.wait('@getSession');
    cy.wait('@getTeacher');

    // Intercepter la requête DELETE pour la suppression
    cy.intercept('DELETE', '/api/session/1', { statusCode: 200 }).as(
      'deleteSession'
    );

    // Cliquer sur le bouton de suppression
    cy.get('mat-icon').contains('delete').click();

    // Vérifier que la requête DELETE a été envoyée
    cy.wait('@deleteSession').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // Vérifier que le snackbar de succès s'affiche
    cy.get('simple-snack-bar .mat-simple-snack-bar-content')
      .should('be.visible')
      .and('contain', 'Session deleted !');

    // Vérifier la redirection sur la page des sessions
    cy.url().should('include', '/sessions');
  });

  it('Should not show delete and edit buttons for non-admin users', () => {
    // Connecter un utilisateur non admin
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
    // Attendre le chargement des données des sessions
    cy.wait('@getSessions');

    // Vérifier que les boutons "edit" et "create" ne soient pas affichés car l'user n'est pas un admin
    cy.get('mat-card').first().within(() => {
      cy.contains('button', 'Edit').should('not.exist');
    });
    cy.get('button[routerLink="create"]').should('not.exist');
  });
});
