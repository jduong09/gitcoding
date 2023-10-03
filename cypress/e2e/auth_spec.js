const { _ } = Cypress._;

describe('Logging In - Single Sign on', () => {
  Cypress.Commands.add('loginBySingleSignOn', (overrides = {}) => {
    Cypress.log({
      name: 'loginBySingleSignOn',
    });

    const options = {
      method: 'POST',
      url: 'https://dev-mmeddl8avuuo5717.us.auth0.com',
      qs: {
        redirectTo: 'http://localhost:5000/callback',
      },
      form: true,
      body: {
        username: 'test@aol.com',
        password: 'Password123'
      }
    }

    _.extend(options, overrides);

    cy.request(options)
  });

  context('Use redirectTo and a session cookie to login', () => {
    /*
      1. Sign into dev.us.auth0.com
      2. Redirect back to our app server
      3. Have our App server set an HttpOnly Session Cookie
      4. Check that we are now properly logged in
    */

    it('is unauthorized without a session cookie', () => {
      // smoke test to show that without looking in we cannot visit the dashboard.
      cy.visit('http://localhost:3000/users/d3bbbcda-a17a-494d-a332-8f87f6d8ed3b');
      // Should redirect to login page.
      // Should contain login form.
      cy.url().should('eq', 'http://localhost:3000')

    });

    it('can authenticate with cy.request', () => {
      cy.getCookie('cypress-session-cookie').should('not.exist');

      cy.loginBySingleSignOn().then((resp) => {
        expect(resp.status).to.eq(200);

        expect(resp.body).to.include('<h1>Welcome to the Dashboard</h1>');
      });

      cy.getCookie('cypress-session-cookie').should('exist');

      cy.visit('http://localhost:3000/users/d3bbbcda-a17a-494d-a332-8f87f6d8ed3b');

      cy.get('h1').should('contain', 'Welcome to the Dashboard');
    });
  });
});