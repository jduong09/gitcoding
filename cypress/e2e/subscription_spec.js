describe('Subscription API', () => {
  before(() => {
    // Before each test login to test user.
    cy.loginViaAuth0Ui(Cypress.env('AUTH0_USERNAME'), Cypress.env('AUTH0_PASSWORD'));
  });
  
  // Before Each, needs to be logged in.
  context('Creating a subscription', () => {
    it('creates a subscription with required inputs inputted.', () => {
      cy.visit(`http://localhost:3000/users/${Cypress.env('AUTH0_USER_UUID')}`);
      // Click Create Subscription Button
      cy.get('button#btn-subscription-create').click();

      // Form should be shown.
      cy.get('input#subscription-name').type('Test Subscription');
      cy.get('input#subscription-reminder-days').type(1);
      cy.get('input#subscription-amount').type(1);
      cy.get('select#due-date-select').select('yearly');
      cy.get('div.DayPicker-Day[aria-label="Sun Oct 29 2023"]').click({ multiple: true, force: true });
      cy.get('input#input-submit-desktop').click();

      cy.get('ul#list-subscriptions').children().should('have.length', 1);
      cy.get('ul#list-subscriptions').children().should('not.have.length', 2);
    });

  });

  context('Reading a subscription', () => {

  });

  context('Updating a subscription', () => {

  });

  context('Deleting a subscription', () => {

  });
});