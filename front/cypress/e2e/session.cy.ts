describe('Session spec', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      // Intercepter la requête POST avec les données du fichier JSON
      cy.intercept('POST', '/api/auth/login', {
        body: users.adminUser, // Utiliser les données depuis users.json
      });

      // Interception des sessions vides
      cy.intercept(
        {
          method: 'GET',
          url: '/api/session',
        },
        []
      ).as('session');

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

      // Interception de la 1ère session
      cy.fixture('sessions.json').then((sessions) => {
        cy.intercept('GET', '/api/session/1', {
          body: sessions[0], // Utilise les données du fichier JSON
        }).as('getSession');
      });

      // Interception du 2ème enseignant
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

  it('Should successfully create a session', () => {
    // Vérifie que le bouton "Create" est visible et clique dessus
    cy.get('button[routerLink="create"]').should('be.visible').click();

    // Vérifie l'accès à la page de création de session
    cy.url().should('include', '/sessions/create');

    // Interception pour la création d'une session
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

    // Remplir le formulaire
    cy.get('input[formControlName=name]').type('session 2');
    cy.get('textarea[formControlName=description]').type('my description');

    // Sélectionner un enseignant dans le champ mat-select
    cy.get('mat-select[formControlName="teacher_id"]').click(); // Ouvre le menu
    cy.get('mat-option').contains('Margot DELAHAYE').click(); // Sélectionne l'enseignant

    // Sélectionner la date
    cy.get('input[formControlName=date]').type('2025-01-01');

    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();

    // Vérifie que la requête POST a été exécutée
    cy.wait('@createSession').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // Vérifie que la snack-bar s'affiche avec le bon message
    cy.get('simple-snack-bar .mat-simple-snack-bar-content')
      .should('be.visible')
      .and('contain', 'Session created !');

    // Vérifie la redirection après soumission
    cy.url().should('include', '/sessions');
  });

  it('Should show detail of a session', () => {
    cy.url().should('include', '/sessions');

    // Attendre que la liste des sessions soit chargée
    cy.wait('@getSessions');

    // Trouve la première carte et clique sur "Detail"
    cy.get('mat-card').first().within(() => {
      cy.contains('button', 'Detail').click();
    });

    // Vérifie l'accès à la page de détail de la session
    cy.url().should('include', '/sessions/detail/1');

    // Attendre que les données de la session et du professeur soient chargées
    cy.wait('@getSession').then((sessionInterception) => {
      cy.wait('@getTeacher').then((interception) => {
        const teacher = interception.response.body; // Récupère les données du professeur
        const session = sessionInterception.response.body; // Récupère les données de la session

        // Vérifie que la description est correcte
        cy.get('.description').should('contain', 'my description');

        // Vérifie que le sous-titre contient "HÉLÈNE THIERCELIN"
        cy.get('mat-card-subtitle').within(() => {
          cy.contains(`${teacher.firstName} ${teacher.lastName.toUpperCase()}`).should('be.visible');
        });

        // Vérifie que le nombre d'attendees est correct
        cy.get('.ml1').should('contain', `${session.users.length}`);

        // Vérifie que le bouton delete s'affiche quand l'user est admin
        cy.get('mat-icon').within(() => {
          cy.contains('delete').should('be.visible');
        });
      });
    });
  });
});
