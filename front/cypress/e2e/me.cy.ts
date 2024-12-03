describe('Me spec', () => {
  beforeEach(() => {
    cy.fixture('users.json').then((users) => {
      // Intercepte la requête POST pour le login
      cy.intercept('POST', '/api/auth/login', {
        body: users.randomUser, // Utilise les données du fichier JSON
      });

      // Interception de l'utilisateur
      cy.fixture('users.json').then((user) => {
        cy.intercept('GET', '/api/user/2', {
          body: user.randomUser, // Utilise les données du fichier JSON
        }).as('getUser');
      });

      // Navigation vers la page de login et connexion
      cy.visit('/login');
      cy.get('input[formControlName=email]').type('daryl@mail.com');
      cy.get('input[formControlName=password]').type('test!1234');
      cy.get('button[type="submit"]').click(); // Soumettre le formulaire
    });
  });

  it('Should display profile user and navigate back when clicking arrow back button', () => {
    // Accéder à la page profil
    cy.get('span[routerLink="me"]').should('be.visible').click();

    // Vérifier que l'URL contient "/me"
    cy.url().should('include', '/me');

    // Attendre la réponse du backend pour le profil utilisateur
    cy.wait('@getUser');

    // Vérifier les informations du profil affiché
    cy.get('mat-card-content').within(() => {
      cy.contains('Daryl DIXON').should('be.visible');
    });

    // Stub de `window.history.back`
    cy.window().then((win) => {
      cy.stub(win.history, 'back').as('historyBack');
    });

    // Cliquer sur le bouton de retour
    cy.get('.mat-icon-button').within(() => {
      cy.contains('mat-icon', 'arrow_back').click();
    });

    // Vérifier que `window.history.back` a été appelé
    cy.get('@historyBack').should('have.been.calledOnce');
  });

  it('Should delete user account', () => {
    // Accéder à la page profil
        cy.get('span[routerLink="me"]').should('be.visible').click();

        // Vérifier que l'URL contient "/me"
        cy.url().should('include', '/me');

        // Attendre la réponse du backend pour le profil utilisateur
        cy.wait('@getUser');

        // Vérifier les informations du profil affiché
        cy.get('mat-card-content').within(() => {
          cy.contains('Daryl DIXON').should('be.visible');
        });

      // Interception de la requête DELETE pour la suppression
          cy.intercept('DELETE', '/api/user/2', {
            statusCode: 200, // Simule une suppression réussie
          }).as('deleteRequest');

          // Cliquer sur le bouton de suppression
          cy.get('button.mat-raised-button')
            .contains('Detail')
            .should('be.visible')
            .click();

          // Vérifier que la requête DELETE a été envoyée
          cy.wait('@deleteRequest').its('response.statusCode').should('eq', 200);

          // Vérifier que le snackbar de succès s'affiche
          cy.get('.mat-snack-bar-container')
            .should('be.visible')
            .and('contain', 'Your account has been deleted !');

    // Vérification : Redirection vers la page d'accueil
    cy.url().should('include', '/');

      // Vérifier que l'option de connexion est disponible
      cy.get('span[routerLink="login"]').should('be.visible');
  });
});
