describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should log in successfully', () => {
    cy.fixture('users.json').then((users) => {
      // Intercepter la requête POST avec les données du fichier JSON
      cy.intercept('POST', '/api/auth/login', {
        body: users.adminUser, // Utiliser les données depuis users.json
      }).as('loginRequest');

      cy.intercept(
        {
          method: 'GET',
          url: '/api/session',
        },
        []
      ).as('session');

      cy.get('input[formControlName=email]').type("yoga@studio.com");
      cy.get('input[formControlName=password]').type(`${"test!1234"}`);
      cy.get('button[type="submit"]').click();

      // Vérifier que la connexion est réussie
      cy.wait('@loginRequest');

      // Vérifier que l'URL contient "/sessions"
      cy.url().should('include', '/sessions');
    });
  });

  it('should fail to log in and display an error message', () => {
    // Intercepter la requête POST pour simuler une erreur
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 400,
    });

    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"t"}`);
    cy.get('button[type="submit"]').click();

    // Vérifier que le message d'erreur est visible et contient le texte attendu
    cy.get('.error')
      .should('be.visible')
      .and('contain', 'An error occurred');
  });
});
