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
  cy.get('a#link-logo').should('have.text', 'Water Your Subs');
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

Cypress.Commands.add('logoutUser', () => {
  const log = Cypress.log({
    name: 'logoutUser'
  });

  log.snapshot('before');

  // Open Navbar DropDown Menu Link to expose sign out button.
  cy.get('a#navbarDropdownMenuLink').click();
  // Click Log Out button
  cy.get('button#btn-logout').click();
});
