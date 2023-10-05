const { _ } = Cypress;

function loginViaAuth0Ui(authUsername, authPassword) {
  const args = { authUsername, authPassword }; 
  cy.origin(Cypress.env('DOMAIN'), { args }, () => {
    cy.get('input#username').type();
    cy.get('input#password').type( , { log: false });
    // cy.contains('button[value=default]', 'Continue').click();
  });
  cy.url().should('equal', 'http://localhost:3000/');
}

Cypress.Commands.add('loginViaAuth0Ui', (username, password) => {
  const log = Cypress.log({
    name: 'loginViaAuth0Ui',
  });

  log.snapshot('before');

  loginViaAuth0Ui(username, password);
  log.snapshot('after');
  log.end();
});

describe('Logging In - Single Sign on', () => {

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
      // How to check that it redirects to our login form, which is controlled by OAuth.
    });

    it('can authenticate with cy.request', () => {
      cy.loginViaAuth0Ui('test@aol.com', 'Password123');

      cy.getCookie('cypress-session-cookie').should('exist');

      cy.get('h1').should('contain', 'Welcome to the Dashboard');
    });
  });
});