import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parseMoney } from '../utils/money';

/** First step of the checkout: the shopping cart. */
export class CartPage extends BasePage {
  readonly productTitles: Locator;
  readonly productQuantities: Locator;
  readonly linePrices: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitles = page.getByTestId('product-title');
    this.productQuantities = page.getByTestId('product-quantity');
    this.linePrices = page.getByTestId('line-price');
    this.total = page.getByTestId('cart-total');
  }

  async linePrice(index = 0): Promise<number> {
    return parseMoney(await this.linePrices.nth(index).innerText());
  }

  async totalPrice(): Promise<number> {
    return parseMoney(await this.total.innerText());
  }
}
