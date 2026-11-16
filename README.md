# Playwright QA Portfolio

End-to-end test automation project built with **Playwright + TypeScript**. It covers UI, API and
accessibility testing of [Toolshop](https://practicesoftwaretesting.com), a public demo e-commerce
application made for test automation practice.

<!-- After the first push, replace USER with your GitHub username:
[![Playwright tests](https://github.com/USER/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/USER/playwright-qa-portfolio/actions/workflows/playwright.yml)
Latest HTML report: https://USER.github.io/playwright-qa-portfolio/
-->

## What it shows

| Area | How |
| --- | --- |
| UI testing | Page Object Model, custom fixtures, web-first assertions, no hard waits |
| API testing | Typed API client, status + contract + negative checks |
| UI/API consistency | The UI is checked against the API as the source of truth |
| Accessibility | axe-core scans against WCAG 2.1 A/AA with a baseline of known issues |
| CI/CD | GitHub Actions on push, PR and schedule; HTML report published to GitHub Pages |
| Debuggability | Trace, screenshot and video kept for failed tests |

## Test coverage

**UI** (`tests/ui`)

- Catalog: search with results, search without results, sort by price, sort by name
- Cart: add a product with quantity, verify line price and total
- Product: name and price match the API
- Login: sign in and sign out, invalid credentials

**API** (`tests/api`)

- Products: pagination, pages do not overlap, get by id, 404 on unknown id, search
- Brands: response contract
- Auth: login returns a usable token, invalid credentials, missing token, tampered token

**Accessibility** (`tests/a11y`)

- Home and login pages, failing on any new critical or serious WCAG violation

## Project structure

```
src/
  api/         Typed client for the REST API
  config/      Environment configuration (URLs, demo credentials)
  fixtures/    Playwright fixtures that inject page objects and the API client
  pages/       Page objects and shared components (NavBar)
  utils/       Small helpers
tests/
  ui/          Browser tests
  api/         API tests (no browser)
  a11y/        Accessibility scans
```

Design decisions:

- **Locators live in page objects, assertions live in tests.** Page objects expose locators and
  actions; tests decide what to assert, so a failure reads as a broken expectation.
- **Fixtures instead of `new Page()` in every test.** Tests declare what they need and stay short.
- **`data-test` attributes first.** The app exposes them, so tests do not depend on styling or copy.
- **No fixed waits.** Only web-first assertions and `expect.poll` for values that settle over time.
- **Each test is independent.** They run fully in parallel, in any order.

## Running it

Requires Node.js 20 or newer.

```bash
npm ci
npx playwright install chromium

npm test              # everything
npm run test:ui       # browser tests
npm run test:api      # API tests
npm run test:a11y     # accessibility scans
npm run test:headed   # browser tests with a visible browser
npm run report        # open the last HTML report
```

Configuration is read from environment variables, with defaults for the public demo:

| Variable | Default |
| --- | --- |
| `BASE_URL` | `https://practicesoftwaretesting.com` |
| `API_URL` | `https://api.practicesoftwaretesting.com` |
| `CUSTOMER_EMAIL` / `CUSTOMER_PASSWORD` | Demo customer published in the Toolshop documentation |

## Findings

The accessibility scans found real defects in the demo application. They are baselined in
`tests/a11y/accessibility.spec.ts` so the suite stays green but still fails on anything new.

| Severity | Page | Issue | WCAG |
| --- | --- | --- | --- |
| Critical | Login | The show/hide password button has no accessible name | 4.1.2 |
| Serious | All | The language selector `aria-label` does not include its visible text | 2.5.3 |
| Serious | Home | Filter lists contain direct children that are not `<li>` | 1.3.1 |

## CI

`.github/workflows/playwright.yml` type-checks the project, runs the full suite on Chromium and
uploads the HTML report as an artifact. On `main`, the report is also published to GitHub Pages.
A scheduled run on weekdays catches changes in the demo site.
