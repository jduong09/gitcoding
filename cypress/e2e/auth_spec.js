function loginViaAuth0Ui(processUsername, processPassword) {
  // const sentArgs = { username: processUsername, password: processPassword };
  cy.visit('/');

  cy.get('a').click();

  const sentArgs = { username: processUsername, password: processPassword };
  
  cy.origin(Cypress.env('DOMAIN'), { args: sentArgs }, ({ username, password }) => {
    cy.get('input#username').type(username);
    cy.get('input#password').type(`${password}{enter}`, { log: false });

  });
  cy.getCookie('connect.sid').should('exist');
  cy.get('h1#nav-header').should('have.html', 'Water Your Subs');
  /*
  */
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
    });
    
    // How to check that it redirects to our login form, which is controlled by OAuth.
    it('can authenticate with cy.request', () => {
      cy.getCookie('connect.sid').should('not.exist');
      loginViaAuth0Ui(Cypress.env('AUTH0_USERNAME'), Cypress.env('AUTH0_PASSWORD'));
    });
  });
});