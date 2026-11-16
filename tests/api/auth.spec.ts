import { env } from '../../src/config/env';
import { expect, test } from '../../src/fixtures/test';

test.describe('Auth API', () => {
  test('POST /users/login returns a token that grants access to the profile', async ({ api }) => {
    const login = await api.login(env.customer.email, env.customer.password);

    expect(login.status()).toBe(200);
    const { access_token: token } = (await login.json()) as { access_token: string };
    expect(token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);

    const me = await api.getCurrentUser(token);

    expect(me.status()).toBe(200);
    expect(await me.json()).toEqual(expect.objectContaining({ email: env.customer.email }));
  });

  test('POST /users/login rejects invalid credentials', async ({ api }) => {
    const response = await api.login('nobody@example.com', 'not-the-password');

    expect(response.status()).toBe(401);
    expect(await response.json()).not.toHaveProperty('access_token');
  });

  test('GET /users/me requires authentication', async ({ api }) => {
    const response = await api.getCurrentUser();

    expect(response.status()).toBe(401);
  });

  test('GET /users/me rejects a tampered token', async ({ api }) => {
    const response = await api.getCurrentUser('not.a.valid-token');

    expect(response.status()).toBe(401);
  });
});
