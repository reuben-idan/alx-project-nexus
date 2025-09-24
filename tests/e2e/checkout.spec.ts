import { test, expect } from '@playwright/test';

// Seed cart in localStorage and verify checkout flow images and order placement
const seedCart = [
  {
    id: '5',
    productId: '5',
    name: 'Sourdough Bread',
    price: 4.99,
    quantity: 1,
    image: '/images/Sourdough Bread.png',
  },
  {
    id: '1',
    productId: '1',
    name: 'Premium Apple',
    price: 2.99,
    quantity: 2,
    image: '/images/Premium Apple.png',
  },
];

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app shell then set localStorage
    await page.goto('/');
    await page.evaluate((items) => {
      localStorage.setItem('cart', JSON.stringify({ items, summary: { total: items.reduce((s:any,i:any) => s + i.price * i.quantity, 0) } }));
    }, seedCart);
  });

  test('cart items show correct images and checkout completes', async ({ page }) => {
    await page.goto('/cart');
    // ensure images have expected src attributes
    const images = await page.locator('img').filter({ hasText: '' }).all();
    // Verify that at least one cart image references Sourdough Bread and Premium Apple
    const imgSrcs = await Promise.all(images.map(async (img) => img.getAttribute('src')));
    expect(imgSrcs.some(src => src && src.includes('Sourdough Bread'))).toBeTruthy();
    expect(imgSrcs.some(src => src && src.includes('Premium Apple'))).toBeTruthy();

    // Proceed to checkout
    await page.click('text=Checkout');

    // Fill shipping form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input#firstName', 'Test');
    await page.fill('input#lastName', 'User');
    await page.fill('input#address', '123 Test St');
    await page.fill('input#city', 'Testville');
    await page.fill('input#state', 'TS');
    await page.fill('input#zipCode', '12345');
    await page.fill('input#phone', '555-1234');

    // Continue to payment
    await page.click('text=Continue to Payment');

    // Fill credit card
    await page.fill('input#cardNumber', '4242424242424242');
    await page.fill('input#cardName', 'Test User');
    await page.fill('input#cardExpiry', '12/30');
    await page.fill('input#cardCvv', '123');

    // Continue to review
    await page.click('text=Continue to Payment');
    await page.click('text=Place Order');

    // Wait for order complete
    await expect(page.locator('text=Order Placed Successfully')).toBeVisible({ timeout: 10000 });
  });
});
