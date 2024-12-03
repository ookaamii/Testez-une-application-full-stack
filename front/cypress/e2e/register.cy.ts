describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should successfully register the user', () => {
    // Intercepter la requête POST avec le message de succès
    cy.intercept('POST', '/api/auth/register', {
      body: {
        message: 'User registered successfully!'
      },
    });

    // Remplir le formulaire d'inscription
    cy.get('input[formControlName=email]').type("daryl@mail.com");
    cy.get('input[formControlName=firstName]').type("Daryl");
    cy.get('input[formControlName=lastName]').type("Dixon");
    cy.get('input[formControlName=password]').type(`${"test!1234"}`);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/login');
  });

  it('should disable the Submit button when the form is invalid', () => {
    // Remplir un formulaire invalide (mauvaise formation de mail)
    cy.get('input[formControlName=email]').type("v");
    cy.get('input[formControlName=firstName]').type("Daryl");
    cy.get('input[formControlName=lastName]').type("Dixon");
    cy.get('input[formControlName=password]').type(`${"t"}`);

    // Vérifier que le bouton de submit est désactivé
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should display an error message on failed registration', () => {
    cy.visit('/register');

    // Intercepter la requête POST avec une erreur
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
    }).as('registerFailed');

    // Remplir un formulaire invalide (mot de passe trop court)
    cy.get('input[formControlName=email]').type("daryl@mail.com");
    cy.get('input[formControlName=firstName]').type("Daryl");
    cy.get('input[formControlName=lastName]').type("Dixon");
    cy.get('input[formControlName=password]').type("t");

    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();

    // Vérifier que l'erreur soit affichée
    cy.wait('@registerFailed');
    cy.get('.error')
      .should('be.visible')
      .should('contain', 'An error occurred');
  });

});
