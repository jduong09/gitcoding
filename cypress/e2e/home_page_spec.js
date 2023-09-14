describe('The Landing Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });

  it('contains header one', () => {
    cy.visit('/');
    cy.get('main h1',{withinSubject:null}).should('have.text', 'Keep Your Subscriptions Healthy ');
  });

  it('contains sign in button', () => {
    cy.visit('/');
    cy.get('[data-cy="sign-in"]',{withinSubject:null}).should('have.text', 'Sign In');
  });
  // TODO: May need some mock data to simulate for tests
});