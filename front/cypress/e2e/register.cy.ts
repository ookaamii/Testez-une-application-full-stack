describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should successfully register the user', () => {
    cy.intercept('POST', '/api/auth/register', {
      body: {
        message: 'User registered successfully!'
      },
    });

    cy.get('input[formControlName=email]').type("toto@toto.com");
    cy.get('input[formControlName=firstName]').type("toto");
    cy.get('input[formControlName=lastName]').type("toto");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.url().should('include', '/login');
  });

  it('should disable the Submit button when the form is invalid', () => {
    // Remplir un formulaire invalide
    cy.get('input[formControlName=email]').type("v");
    cy.get('input[formControlName=firstName]').type("toto");
    cy.get('input[formControlName=lastName]').type("toto");
    cy.get('input[formControlName=password]').type(`${"t"}`);

    // Vérifier que le bouton Submit est désactivé
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should display an error message on failed registration', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
    }).as('registerFailed');

    // Remplir un formulaire valide
    cy.get('input[formControlName=email]').type("toto@mail.com");
    cy.get('input[formControlName=firstName]').type("toto");
    cy.get('input[formControlName=lastName]').type("toto");
    cy.get('input[formControlName=password]').type("t");

    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();

    // Vérifier que l'erreur est affichée
    cy.wait('@registerFailed');
    cy.get('.error')
      .should('be.visible')
      .should('contain', 'An error occurred');
  });

});
