class CartPage {
    get cartItems() { return $$('.cart_item'); }
    get checkoutBtn() { return $('#checkout'); }
    get removeBtns() { return $$('button.cart_button'); }

    async removeAllItems() {
        for (const btn of await this.removeBtns) {
            await btn.click();
        }
        await browser.waitUntil(async () => (await this.cartItems).length === 0);
    }

    async proceedToCheckout() {
        await this.checkoutBtn.click();
    }
}

module.exports = new CartPage();
