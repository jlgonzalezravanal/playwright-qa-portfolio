import { expect, test } from '../../src/fixtures/test';

test.describe('Shopping cart', () => {
  test('adding a product shows it in the cart with the right totals', async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    const productName = 'Combination Pliers';
    const quantity = 2;

    await homePage.goto();
    await homePage.openProduct(productName);
    await expect(productPage.name).toHaveText(productName);
    const unitPrice = await productPage.price();

    await productPage.setQuantity(quantity);
    await productPage.addToCart();

    await expect(productPage.toast).toContainText('Product added to shopping cart');
    await expect(productPage.nav.cartQuantity).toHaveText(String(quantity));

    await productPage.nav.openCart();

    await expect(cartPage.productTitles).toHaveText([productName]);
    await expect(cartPage.productQuantities).toHaveValue(String(quantity));
    expect(await cartPage.linePrice()).toBeCloseTo(unitPrice * quantity, 2);
    expect(await cartPage.totalPrice()).toBeCloseTo(unitPrice * quantity, 2);
  });

  test('product page shows the same name and price as the API', async ({ api, productPage }) => {
    const product = await api.findProduct('hammer');

    await productPage.goto(product.id);

    await expect(productPage.name).toHaveText(product.name);
    expect(await productPage.price()).toBeCloseTo(product.price, 2);
  });
});
