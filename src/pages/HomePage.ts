import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parseMoney } from '../utils/money';

export type SortOption =
  | 'Name (A - Z)'
  | 'Name (Z - A)'
  | 'Price (High - Low)'
  | 'Price (Low - High)';

/** Product catalog: listing, search and sorting. */
export class HomePage extends BasePage {
  readonly productCards: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResults: Locator;
  readonly searchResultCount: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('a[data-test^="product-"]');
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.searchResults = page.getByTestId('search_completed');
    this.searchResultCount = page.getByTestId('search-result-count');
    this.sortSelect = page.getByTestId('sort');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.productCards.first().waitFor();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await this.searchResults.waitFor();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption({ label: option });
  }

  async productNames(): Promise<string[]> {
    const names = await this.productCards.getByTestId('product-name').allInnerTexts();
    return names.map((name) => name.trim());
  }

  async productPrices(): Promise<number[]> {
    const prices = await this.productCards.getByTestId('product-price').allInnerTexts();
    return prices.map(parseMoney);
  }

  async openProduct(name: string): Promise<void> {
    await this.productCards
      .filter({ has: this.page.getByTestId('product-name').getByText(name, { exact: true }) })
      .click();
  }
}
