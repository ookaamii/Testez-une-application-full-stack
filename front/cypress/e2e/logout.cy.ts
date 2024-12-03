describe('Logout spec', () => {
  beforeEach(() => {
    // Interception de l'API de connexion
    cy.fixture('users.json').then((users) => {
      cy.intercept('POST', '/api/auth/login', {
        body: users.adminUser, // Simule la réponse de l'API avec un utilisateur
      }).as('loginRequest');

      // Initialisation : Navigation vers la page de connexion
      cy.visit('/login');
      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type(`${"test!1234"}`);
      cy.get('button[type="submit"]').click();

      // Vérifier que la connexion est réussie
      cy.wait('@loginRequest');
    });
  });

  it('should log out the user and redirect to the home page', () => {
    // Cliquer sur le bouton de déconnexion
    cy.get('span').contains('Logout').click();

    // Vérifier la redirection page d'accueil
    cy.url().should('include', '/');

    // Vérifier que le bouton de connexion soit de nouveau disponible
    cy.get('span[routerLink="login"]').should('be.visible');
  });
});
