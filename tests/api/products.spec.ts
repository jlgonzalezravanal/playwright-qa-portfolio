import { type Brand, type Paginated, type Product } from '../../src/api/ToolshopApi';
import { expect, test } from '../../src/fixtures/test';

test.describe('Products API', () => {
  test('GET /products returns a paginated list', async ({ api }) => {
    const response = await api.getProducts({ page: 1 });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as Paginated<Product>;
    expect(body.current_page).toBe(1);
    expect(body.total).toBeGreaterThan(0);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.length).toBeLessThanOrEqual(body.per_page);
    for (const product of body.data) {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
        }),
      );
      expect(product.price).toBeGreaterThan(0);
    }
  });

  test('GET /products pages do not overlap', async ({ api }) => {
    const [first, second] = await Promise.all([
      api.getProducts({ page: 1 }),
      api.getProducts({ page: 2 }),
    ]);
    const firstIds = ((await first.json()) as Paginated<Product>).data.map((p) => p.id);
    const secondIds = ((await second.json()) as Paginated<Product>).data.map((p) => p.id);

    expect(secondIds.length).toBeGreaterThan(0);
    expect(firstIds.filter((id) => secondIds.includes(id))).toEqual([]);
  });

  test('GET /products/{id} returns the same product as the list', async ({ api }) => {
    const list = (await (await api.getProducts()).json()) as Paginated<Product>;
    const expected = list.data[0];

    const response = await api.getProduct(expected.id);

    expect(response.status()).toBe(200);
    const product = (await response.json()) as Product;
    expect(product.id).toBe(expected.id);
    expect(product.name).toBe(expected.name);
    expect(product.price).toBe(expected.price);
  });

  test('GET /products/{id} returns 404 for an unknown id', async ({ api }) => {
    const response = await api.getProduct('does-not-exist');

    expect(response.status()).toBe(404);
  });

  test('GET /products/search only returns matching products', async ({ api }) => {
    const response = await api.searchProducts('pliers');

    expect(response.status()).toBe(200);
    const body = (await response.json()) as Paginated<Product>;
    expect(body.data.length).toBeGreaterThan(0);
    for (const product of body.data) {
      expect(product.name.toLowerCase()).toContain('pliers');
    }
  });

  test('GET /brands returns brands with id, name and slug', async ({ api }) => {
    const response = await api.getBrands();

    expect(response.status()).toBe(200);
    const brands = (await response.json()) as Brand[];
    expect(brands.length).toBeGreaterThan(0);
    for (const brand of brands) {
      expect(brand.id).toBeTruthy();
      expect(brand.name).toBeTruthy();
      expect(brand.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
