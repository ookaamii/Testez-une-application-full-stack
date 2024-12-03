describe('Logout spec', () => {
  beforeEach(() => {
    // Interception de l'API de connexion
    cy.fixture('users.json').then((users) => {
      cy.intercept('POST', '/api/auth/login', {
        body: users.randomUser, // Simule la réponse de l'API avec un utilisateur
      }).as('loginRequest');

      // Initialisation : Navigation vers la page de connexion
      cy.visit('/login');
      cy.get('input[formControlName=email]').type('user@mail.com');
      cy.get('input[formControlName=password]').type('password123');
      cy.get('button[type="submit"]').click();

      // Vérifier que la connexion est réussie
      cy.wait('@loginRequest');
    });
  });

  it('should log out the user and redirect to the home page', () => {
    // Cliquer sur le bouton de déconnexion (par exemple un bouton "Log Out")
    cy.get('span').contains('Logout').click();

    // Vérifier que l'URL contient "/"
    cy.url().should('include', '/');

    // Vérifier que l'option de connexion est disponible
    cy.get('span[routerLink="login"]').should('be.visible');
  });
});
