describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/', { headers: { "Accept-Encoding": "gzip, deflate" } });
  });

  it('allows you to sign in', () => {
    cy.contains('Sign In');
  });

  // TODO: May need some mock data to simulate for tests
});