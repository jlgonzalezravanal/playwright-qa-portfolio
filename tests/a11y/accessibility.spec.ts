import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '../../src/fixtures/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const BLOCKING_IMPACTS = ['critical', 'serious'];

/**
 * Defects already found by this suite in the demo site (see "Findings" in the
 * README). They are baselined so the suite stays green while still failing on
 * any NEW critical or serious violation.
 */
const KNOWN_ISSUES: Record<string, string> = {
  'button-name': 'Login: the show/hide password toggle has no accessible name (WCAG 4.1.2)',
  'label-content-name-mismatch':
    'Header: the language selector aria-label does not contain its visible text (WCAG 2.5.3)',
  list: 'Home: filter lists contain non-<li> direct children (WCAG 1.3.1)',
};

const PAGES = [
  { name: 'home', path: '/', ready: 'search-query' },
  { name: 'login', path: '/auth/login', ready: 'login-submit' },
];

test.describe('Accessibility (WCAG 2.1 A/AA)', () => {
  for (const target of PAGES) {
    test(`${target.name} page has no new critical or serious violations`, async ({
      page,
    }, testInfo) => {
      await page.goto(target.path);
      await page.getByTestId(target.ready).waitFor();

      const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      await testInfo.attach('axe-violations', {
        body: JSON.stringify(violations, null, 2),
        contentType: 'application/json',
      });

      const blocking = violations.filter((v) => BLOCKING_IMPACTS.includes(v.impact ?? ''));
      for (const violation of blocking.filter((v) => v.id in KNOWN_ISSUES)) {
        testInfo.annotations.push({ type: 'known issue', description: KNOWN_ISSUES[violation.id] });
      }

      const unexpected = blocking.filter((v) => !(v.id in KNOWN_ISSUES));
      expect(unexpected.map((v) => `${v.impact}: ${v.id} - ${v.help}`)).toEqual([]);
    });
  }
});
