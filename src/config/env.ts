/**
 * Environment configuration. Defaults point to the public Toolshop demo;
 * the customer account is the demo user published in the site's documentation.
 */
export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://practicesoftwaretesting.com',
  apiUrl: process.env.API_URL ?? 'https://api.practicesoftwaretesting.com',
  customer: {
    email: process.env.CUSTOMER_EMAIL ?? 'customer@practicesoftwaretesting.com',
    password: process.env.CUSTOMER_PASSWORD ?? 'welcome01',
  },
};
