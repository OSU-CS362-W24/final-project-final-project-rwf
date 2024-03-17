it('Chart is correctly generated', () => {
  cy.visit('/')
  cy.findByRole("link", { name: "Line" }).click()

  cy.findByLabelText('X label').type("X")
  cy.findByLabelText('Y label').type("Y")
  cy.findByLabelText('X').type("1")
  cy.findByLabelText('Y').type("2")
  cy.findByLabelText("Chart title").type("title")
  cy.findByRole("button", { name: "Generate chart" }).click()

  cy.document().its("body").find("img").should("exist");
})

it('Chart data is maintained across pages', () => {
  cy.visit('/')
  cy.findByRole("link", { name: "Line" }).click()

  cy.findByLabelText('X label').type("This is the X Label")
  cy.findByLabelText('Y label').type("This is the Y Label")
  cy.findByLabelText('X').type("101")
  cy.findByLabelText('Y').type("201")
  cy.findByLabelText("Chart title").type("This is the chart Title")
  cy.findByLabelText('Chart color').invoke('val', '#ff0000').trigger('change');

  // check if values are consistent in the scatter plot
  cy.findByRole("link", { name: "Scatter" }).click()

  cy.findByLabelText('X label').should('have.value', "This is the X Label");
  cy.findByLabelText('Y label').should('have.value', "This is the Y Label");
  // needed to isolate the first X input
  cy.findAllByLabelText('X').then(($elements) => {
    cy.wrap($elements[0]).should('have.value', '101');
  });
  cy.findAllByLabelText('Y').then(($elements) => {
    cy.wrap($elements[0]).should('have.value', '201');
  });
  cy.findByLabelText("Chart title").should('have.value', "This is the chart Title");
  cy.findByLabelText("Chart color").should('have.value', "#ff0000");

  // check if values are consistent in the Bar plot
  cy.findByRole("link", { name: "Bar" }).click()

  cy.findByLabelText('X label').should('have.value', "This is the X Label");
  cy.findByLabelText('Y label').should('have.value', "This is the Y Label");
  cy.findAllByLabelText('X').then(($elements) => {
    cy.wrap($elements[0]).should('have.value', '101');
  });
  cy.findAllByLabelText('Y').then(($elements) => {
    cy.wrap($elements[0]).should('have.value', '201');
  });
  cy.findByLabelText("Chart title").should('have.value', "This is the chart Title");
  cy.findByLabelText("Chart color").should('have.value', "#ff0000");
})