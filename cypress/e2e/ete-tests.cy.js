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
