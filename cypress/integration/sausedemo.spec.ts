describe("sausedemo", () => {
  const firstname = Math.random().toString(36).substring(7);
  const lastname = Math.random().toString(36).substring(7);
  const postalcode = Math.floor(Math.random() * 101).toString();
  let tax,
    total = 0;

  it("loginto the application", () => {
    cy.visit("/");
    cy.get('[data-test="username"]').type("standard_user");
    cy.get('[data-test="password"]').type("secret_sauce");
    cy.get('[data-test="login-button"]').click();
    cy.get('*[data-test^="add-to-cart"]')
      .filter((index) => {
        return index < 3;
      })
      .each(($element) => {
        cy.wrap($element).click();
      });
    cy.get(".shopping_cart_link").click();
    let sum = 0;
    cy.get(".inventory_item_price").each(($price) => {
      sum += parseFloat($price.text().replace("$", ""));
      cy.log(sum.toString());
    });
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="firstName"]').type(firstname);
    cy.get('[data-test="lastName"]').type(lastname);
    cy.get('[data-test="postalCode"]').type(postalcode);
    cy.get('[data-test="continue"]').click();
    cy.get(".summary_subtotal_label")
      .invoke("text")
      .then((text) => {
        expect(text.replace("Item total: $", "")).to.equal(sum.toString());
      });
    cy.get(".summary_value_label").contains("SauceCard #31337").should("exist");
    cy.get(".summary_value_label")
      .contains("Free Pony Express Delivery!")
      .should("exist");

    //Get the Tax Amount
    cy.get(".summary_tax_label")
      .invoke("text")
      .then((text) => {
        tax = parseFloat(text.replace("Tax: $", ""));
      });
    //Assert the Total amount
    cy.get('div[class*="summary_total_label"]')
      .invoke("text")
      .then((text) => {
        total = parseFloat(text.replace("Total: $", ""));
        let acutaltotal = sum + tax;
        expect(total).to.equal(acutaltotal);
      });

    //assert the confirmation message
    cy.get('[data-test="finish"]').click();
    cy.get(".complete-header")
      .contains("Thank you for your order!")
      .should("exist");
  });
});
