describe('Subscription API', () => {
  beforeEach(() => {
    // Before each test login to test user.
    cy.loginViaAuth0Ui(Cypress.env('AUTH0_USERNAME'), Cypress.env('AUTH0_PASSWORD'));
  });

  context('Creating a subscription', () => {
    it('creates a subscription with required inputs inputted.', () => {
      cy.visit(`http://localhost:3000/users/${Cypress.env('AUTH0_USER_UUID')}`);
      cy.get('button#btn-subscription-create').click();

      cy.get('input#subscription-name').type('Test Subscription');
      cy.get('input#subscription-reminder-days').type(1);
      cy.get('input#subscription-amount').type(1);
      cy.get('select#due-date-select').select('yearly');
      cy.get('div#div-subscription-create div.DayPicker-Day[aria-label="Sun Oct 29 2023"]').click();
      cy.get('input#input-submit-desktop').click();

      cy.get('ul#list-subscriptions').children().should('have.length', 1);
      cy.get('ul#list-subscriptions').children().should('not.have.length', 2);
    });

    it('creates a subscription with nickname inputted', () => {
      cy.visit(`http://localhost:3000/users/${Cypress.env('AUTH0_USER_UUID')}`);
      cy.get('button#btn-subscription-create').click();

      cy.get('input#subscription-name').type('Second Test Subscription');
      cy.get('input#subscription-nickname').type('hehe');

      cy.get('input#subscription-reminder-days').type(2);
      cy.get('input#subscription-amount').type(2);
      cy.get('select#due-date-select').select('yearly');
      cy.get('div#div-subscription-create div.DayPicker-Day[aria-label="Mon Oct 02 2023"]').click();
      cy.get('input#input-submit-desktop').click();

      cy.get('ul#list-subscriptions').children().should('have.length', 2);
      cy.get('ul#list-subscriptions').children().should('not.have.length', 3);
    });
  });
  /*

  context('Reading a subscription', () => {
    it('shows subscription highlighted in subscriptions list', () => {
      cy.get('ul#list-subscriptions li:first').click();
      
      cy.get('ul#list-subscriptions li:first').should('have.class', 'activeCard');
    });

    it('shows calendar with subscription day selected', () => {
      cy.get('ul#list-subscriptions li:first').click();

      cy.get('div#dayPickerForm').find('div.DayPicker-Day[aria-label="Sun Oct 29 2023"]').should('have.attr', 'aria-selected', 'true');
    });

    it('shows subscription data correctly', () => {
      cy.get('ul#list-subscriptions li:first').click();
      cy.get('div#mainContainer').find('h2').should('have.text', 'Test Subscription');
      cy.get('div#mainContainer').find('ul').children().should('have.length', 3);
    });
  });
  */

  context('Updating a subscription', () => {
    /*
    it('updating name works correctly', () => {
      cy.get('ul#list-subscriptions li:first').click();
      cy.get('button#btn-subscription-update').click();

      cy.get('div#div-subscription-update').find('input#subscription-name').type('{selectall}{backspace}Updated Test');

      cy.get('div#div-subscription-update').find('input#input-submit-desktop').click();

      cy.wait(500);
      cy.get('ul#list-subscriptions li:first').click();
      cy.wait(4000);
      
      cy.get('div#div-subscription-detail').find('h2').should('have.text', 'Updated Test');
    });

    it('updating name that has nickname displays nickname in title and name in info list.', () => {
      cy.get('ul#list-subscriptions li:last').click();
      cy.get('button#btn-subscription-update').click();

      cy.get('div#div-subscription-update').find('input#subscription-name').type('{selectall}{backspace}Second Updated Subscription');
      cy.get('div#div-subscription-update').find('input#input-submit-desktop').click();

      cy.wait(500);
      cy.get('ul#list-subscriptions li:last').click();
      cy.wait(4000);

      cy.get('div#div-subscription-detail').find('ul li:first span').should('have.text', 'Second Updated Subscription');
    });

    it('updating nickname displays updated nickname', () => {
      cy.get('ul#list-subscriptions li:last').click();
      cy.get('button#btn-subscription-update').click();

      cy.get('div#div-subscription-update').find('input#subscription-nickname').type('{selectall}{backspace}Updated Nickname');
      cy.get('div#div-subscription-update').find('input#input-submit-desktop').click();

      cy.wait(500);
      cy.get('ul#list-subscriptions li:last').click();
      cy.wait(4000);

      cy.get('div#div-subscription-detail').find('h2').should('have.text', 'Updated Nickname');
    });

    it('updating alert displays updated alert in subscription detail', () => {
      cy.get('ul#list-subscriptions li:first').click();
      cy.get('button#btn-subscription-update').click();

      cy.get('div#div-subscription-update').find('input#subscription-reminder-days').type('{selectall}{backspace}3');
      cy.get('div#div-subscription-update').find('input#input-submit-desktop').click();

      cy.wait(500);
      cy.get('ul#list-subscriptions li:first').click();
      cy.wait(4000);

      cy.get('div#div-subscription-detail').find('ul li:last span').should('have.text', '3 day(s) before due date');
    });

    it('updating amount displays updated amount in subscription detail', () => {
      cy.get('ul#list-subscriptions li:first').click();
      cy.get('button#btn-subscription-update').click();

      cy.get('div#div-subscription-update').find('input#subscription-amount').type('{selectall}{backspace}9.99');
      cy.get('div#div-subscription-update').find('input#input-submit-desktop').click();

      cy.wait(500);
      cy.get('ul#list-subscriptions li:first').click();
      cy.wait(4000);

      cy.get('div#div-subscription-detail').find('ul li:first span').should('have.text', '$9.99');
    });
    */

    it('updating yearly subscription to monthly, changing date correctly sets next due date', () => {
      cy.get('ul#list-subscriptions li:first').click();
      cy.get('button#btn-subscription-update').click();

      cy.wait(4000);

      cy.get('div#div-subscription-update select#due-date-select').select('monthly');

      cy.get('div#div-subscription-update div.DayPicker-Day[aria-label="Sun Oct 29 2023"]').click();

      cy.get('div#div-subscription-update div.DayPicker-Day[aria-label="Mon Oct 09 2023"]').click();

      cy.get('div#div-subscription-update').find('input#input-submit-desktop').click();

      cy.wait(500);
      cy.get('ul#list-subscriptions li:first').click();
      cy.wait(4000);

      cy.get('div#div-subscription-detail').find('ul li').eq(1).should('have.text', '11/9/2023, Every month on the 9th.');

    });
  });

  /*
  context('Deleting a subscription', () => {
    it('deletes subscription', () => {
      cy.get('ul#list-subscriptions li:first').click();
  
      cy.get('button#btn-subscription-delete').click();
      cy.get('button#btn-modal-subscription-delete').click();
      cy.wait(1000);
      
  
      cy.get('ul#list-subscriptions').children().should('have.length', 1);
    });

    it('deletes second subscription', () => {
      cy.get('ul#list-subscriptions li:first').click();
  
      cy.get('button#btn-subscription-delete').click();
      cy.get('button#btn-modal-subscription-delete').click();
      cy.wait(1000);

      cy.get('ul#list-subscriptions').children().should('have.length', 0);
    });
  });
  */
});