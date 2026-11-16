import { test as base } from '@playwright/test';
import { ToolshopApi } from '../api/ToolshopApi';
import { AccountPage } from '../pages/AccountPage';
import { CartPage } from '../pages/CartPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';

interface Fixtures {
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  loginPage: LoginPage;
  accountPage: AccountPage;
  api: ToolshopApi;
}

/** `test` extended with page objects and the API client, created on demand. */
export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  accountPage: async ({ page }, use) => use(new AccountPage(page)),
  api: async ({ request }, use) => use(new ToolshopApi(request)),
});

export { expect } from '@playwright/test';
