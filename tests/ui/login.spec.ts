import { env } from '../../src/config/env';
import { expect, test } from '../../src/fixtures/test';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('a customer can sign in and sign out', async ({ loginPage, accountPage }) => {
    await loginPage.login(env.customer.email, env.customer.password);

    await expect(accountPage.title).toHaveText('My account');
    await expect(accountPage.nav.userMenu).toBeVisible();
    await expect(accountPage.nav.signInLink).toBeHidden();

    await accountPage.nav.signOut();

    await expect(accountPage.nav.signInLink).toBeVisible();
  });

  test('invalid credentials show an error and keep the user signed out', async ({ loginPage }) => {
    await loginPage.login('nobody@example.com', 'not-the-password');

    await expect(loginPage.error).toHaveText('Invalid email or password');
    await expect(loginPage.nav.signInLink).toBeVisible();
  });
});
