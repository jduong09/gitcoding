describe('Logging In', () => {

  context('Use redirectTo and a session cookie to login', () => {
    /*
      1. Sign into dev.us.auth0.com
      2. Redirect back to our app server
      3. Have our App server set an HttpOnly Session Cookie
      4. Check that we are now properly logged in
    */
    it('is unauthorized without a session cookie', () => {
      // smoke test to show that without looking in we cannot visit the dashboard.
      // Should redirect to login page.
      // Should contain login form.
      cy.getCookie('connect.sid').should('not.exist');
    });
    
    // How to check that it redirects to our login form, which is controlled by OAuth.
    it('can authenticate with cy.request', () => {
      cy.getCookie('connect.sid').should('not.exist');
      cy.loginViaAuth0Ui(Cypress.env('AUTH0_USERNAME'), Cypress.env('AUTH0_PASSWORD'));

      cy.logoutUser();
    });
  });
});

describe('Logging Out', () => {
  context('Use button to log user out', () => {
    it('can log into app, and then click log out button and log out', () => {
      // Show that user is not locked in, if cookie does not exist
      cy.getCookie('connect.sid').should('not.exist');
      // Log in user, here cookie should exist.
      cy.loginViaAuth0Ui(Cypress.env('AUTH0_USERNAME'), Cypress.env('AUTH0_PASSWORD'));
      // Log Out user, clicking log out button.
      cy.logoutUser();
      // Cookie should not exist, user should be logged out. Page should be on landing page.
      cy.url().should('eq', 'http://localhost:3000/');
      cy.getCookie('connect.sid').should('not.exist');
    });
  });
});