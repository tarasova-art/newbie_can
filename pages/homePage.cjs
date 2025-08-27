class HomePage {
    get firstAddBtn() { return $('button.btn_inventory'); }
    get cartBadge() { return $('.shopping_cart_badge'); }
    get cartLink() { return $('.shopping_cart_link'); }

    async addFirstItemToCart() {
        await this.firstAddBtn.waitForClickable();
        await this.firstAddBtn.click();
    }

    async openCart() {
        await this.cartLink.click();
    }

    async getCartBadgeCount() {
        if (await this.cartBadge.isDisplayed()) {
            return await this.cartBadge.getText();
        }
        return "0";
    }
}

module.exports = new HomePage();
