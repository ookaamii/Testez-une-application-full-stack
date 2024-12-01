describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Login successfull', () => {
    cy.fixture('users.json').then((users) => {
          const validUser = users.validUser;

          // Intercepter la requête POST avec les données du fichier JSON
          cy.intercept('POST', '/api/auth/login', {
            body: validUser, // Utiliser les données depuis users.json
          });

          cy.intercept(
            {
              method: 'GET',
              url: '/api/session',
            },
            []
          ).as('session');

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  });
});

  it('Login fail', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 400,
    });

    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"t"}{enter}{enter}`);
    cy.get('.error').should('be.visible').should('contain', 'An error occurred');
  });

});
