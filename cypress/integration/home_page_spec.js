describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/', { timeout: 30000 });
  });

  it('allows you to sign in', () => {
    cy.contains('Sign In');
  });

  // TODO: May need some mock data to simulate for tests
});