import { expect, test } from '../../src/fixtures/test';

test.describe('Product catalog', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('searching returns only products matching the term', async ({ homePage }) => {
    await homePage.search('pliers');

    const names = await homePage.productNames();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.toLowerCase()).toContain('pliers');
    }
    await expect(homePage.searchResultCount).toContainText(`${names.length} products found`);
  });

  test('searching for an unknown product shows no results', async ({ homePage }) => {
    await homePage.search('zzz-no-such-tool');

    await expect(homePage.productCards).toHaveCount(0);
  });

  test('sorting by price high to low orders the listing', async ({ homePage }) => {
    await homePage.sortBy('Price (High - Low)');

    await expect
      .poll(async () => {
        const prices = await homePage.productPrices();
        return prices.length > 1 && prices.every((price, i) => i === 0 || prices[i - 1] >= price);
      })
      .toBe(true);
  });

  test('sorting by name Z to A orders the listing', async ({ homePage }) => {
    await homePage.sortBy('Name (Z - A)');

    await expect
      .poll(async () => {
        const names = await homePage.productNames();
        const sorted = [...names].sort((a, b) => b.localeCompare(a));
        return names.length > 1 && names.join('|') === sorted.join('|');
      })
      .toBe(true);
  });
});
