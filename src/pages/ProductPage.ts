import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parseMoney } from '../utils/money';

export class ProductPage extends BasePage {
  readonly name: Locator;
  readonly unitPrice: Locator;
  readonly quantityInput: Locator;
  readonly increaseQuantityButton: Locator;
  readonly addToCartButton: Locator;
  readonly toast: Locator;

  constructor(page: Page) {
    super(page);
    this.name = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.quantityInput = page.getByTestId('quantity');
    this.increaseQuantityButton = page.getByTestId('increase-quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.toast = page.getByRole('alert');
  }

  async goto(productId: string): Promise<void> {
    await this.page.goto(`/product/${productId}`);
    await this.addToCartButton.waitFor();
  }

  async price(): Promise<number> {
    return parseMoney(await this.unitPrice.innerText());
  }

  async setQuantity(quantity: number): Promise<void> {
    for (let current = 1; current < quantity; current++) {
      await this.increaseQuantityButton.click();
    }
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
