const { expect } = require('chai');
const LoginPage = require('../pages/loginPage.cjs');
const HomePage = require('../pages/homePage.cjs');
const CartPage = require('../pages/cartPage.cjs');
const CheckoutPage = require('../pages/checkoutPage.cjs');

describe('SauceDemo Checkout Flow', () => {

    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login();
        if (await HomePage.getCartBadgeCount() !== "0") {
            await HomePage.openCart();
            await CartPage.removeAllItems();
            await browser.url('https://www.saucedemo.com/inventory.html');
        }
    });


    it('1. Add first item to cart and verify cart badge', async () => {
        await HomePage.addFirstItemToCart();
        expect(await HomePage.getCartBadgeCount()).to.equal('1');
    });

    it('2. Open cart and verify product is displayed', async () => {
        await HomePage.addFirstItemToCart();
        await HomePage.openCart();
        expect((await CartPage.cartItems).length).to.equal(1);
    });

    it('3. Checkout button opens checkout form', async () => {
        await HomePage.addFirstItemToCart();
        await HomePage.openCart();
        await CartPage.proceedToCheckout();
        const currentUrl = await browser.getUrl();
        expect(currentUrl).to.include('/checkout-step-one.html');
    });

    it('4-6. Fill checkout form (First Name, Last Name, Postal Code)', async () => {
        await HomePage.addFirstItemToCart();
        await HomePage.openCart();
        await CartPage.proceedToCheckout();
        await CheckoutPage.fillCheckoutForm();
    });

    it('7. Continue to overview', async () => {
        await HomePage.addFirstItemToCart();
        await HomePage.openCart();
        await CartPage.proceedToCheckout();
        await CheckoutPage.fillCheckoutForm();
        const currentUrl = await browser.getUrl();
        expect(currentUrl).to.include('/checkout-step-two.html');
        await CheckoutPage.summary();
    });

    it('8. Finish checkout and see confirmation message', async () => {
        await HomePage.addFirstItemToCart();
        await HomePage.openCart();
        await CartPage.proceedToCheckout();
        await CheckoutPage.fillCheckoutForm();
        await CheckoutPage.finishOrder();
        expect(await CheckoutPage.getConfirmMessage()).to.equal('Thank you for your order!');
    });

    it('9. Back Home returns to inventory and clears cart', async () => {
        await HomePage.addFirstItemToCart();
        await HomePage.openCart();
        await CartPage.proceedToCheckout();
        await CheckoutPage.fillCheckoutForm();
        await CheckoutPage.finishOrder();
        await CheckoutPage.backHome();
        const currentUrl = await browser.getUrl();
        expect(currentUrl).to.include('/inventory.html');
        expect(await HomePage.getCartBadgeCount()).to.equal('0');
    });
});
