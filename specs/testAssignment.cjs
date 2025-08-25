const { expect } = require('chai');

describe('SauceDemo Checkout Flow', () => {

    beforeEach(async () => {
        await browser.url('https://www.saucedemo.com/');

        await $('#user-name').setValue('standard_user');
        await $('#password').setValue('secret_sauce');
        await $('#login-button').click();

        const currentUrl = await browser.getUrl();
        expect(currentUrl).to.include('/inventory.html');

        const cartBadge = await $('.shopping_cart_badge');
        if (await cartBadge.isExisting()) {
            await $('.shopping_cart_link').click();
            const removeBtns = await $$('button.cart_button');
            for (const btn of removeBtns) { await btn.click(); }

            await browser.waitUntil(async () => (await $$('.cart_item')).length === 0, {
                timeout: 5000,
                timeoutMsg: 'Cart items were not removed in time'
            });

            await browser.url('https://www.saucedemo.com/inventory.html');
        }
    });


    it('1. Add first item to cart and verify cart badge', async () => {
        const firstAddBtn = await $('button.btn_inventory');
        await firstAddBtn.waitForClickable({ timeout: 5000 });
        await firstAddBtn.click();

        const cartBadge = await $('.shopping_cart_badge');
        await cartBadge.waitForDisplayed({ timeout: 5000 });
        expect(await cartBadge.getText()).to.equal('1');
    });

    it('2. Open cart and verify product is displayed', async () => {
        const firstAddBtn = await $('button.btn_inventory');
        await firstAddBtn.click();

        const cartBadge = await $('.shopping_cart_badge');
        await cartBadge.waitForDisplayed({ timeout: 5000 });
        console.log('Cart badge text:', await cartBadge.getText()); 
        const cartLink = await $('.shopping_cart_link');
        await cartLink.click();

        const currentUrl = await browser.getUrl();
        console.log('Current URL after clicking cart:', currentUrl);

        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/cart.html'),
            {
                timeout: 10000,
                timeoutMsg: 'Cart page did not load in time'
            }
        );

        const cartItem = await $('.cart_item');
        await cartItem.waitForExist({ timeout: 5000 });  
        await cartItem.waitForDisplayed({ timeout: 5000 });
        console.log('Cart item HTML:', await cartItem.getHTML());

        expect(await cartItem.isDisplayed()).to.be.true;
    });

    it('3. Checkout button opens checkout form', async () => {
        const firstAddBtn = await $('button.btn_inventory');
        await firstAddBtn.click();
        await $('.shopping_cart_link').click();

        await $('#checkout').click();
        const currentUrl = await browser.getUrl();
        expect(currentUrl).to.include('/checkout-step-one.html');
    });

    it('4-6. Fill checkout form (First Name, Last Name, Postal Code)', async () => {
        await $('button.btn_inventory').click();
        await $('.shopping_cart_link').click();
        await $('#checkout').click();

        const firstName = await $('#first-name');
        await firstName.setValue('John');
        const lastName = await $('#last-name');
        await lastName.setValue('Doe');
        const postalCode = await $('#postal-code');
        await postalCode.setValue('12345');

        expect(await firstName.getValue()).to.equal('John');
        expect(await lastName.getValue()).to.equal('Doe');
        expect(await postalCode.getValue()).to.equal('12345');
    });

    it('7. Continue to overview page', async () => {
        await $('button.btn_inventory').click();
        await $('.shopping_cart_link').click();
        await $('#checkout').click();

        await $('#first-name').setValue('John');
        await $('#last-name').setValue('Doe');
        await $('#postal-code').setValue('12345');
        await $('#continue').click();

        const currentUrl = await browser.getUrl();
        expect(currentUrl).to.include('/checkout-step-two.html');

        const summary = await $('.summary_info');
        await summary.waitForDisplayed({ timeout: 5000 });
        expect(await summary.isDisplayed()).to.be.true;
    });

    it('8. Finish checkout and see confirmation message', async () => {
        await $('button.btn_inventory').click();
        await $('.shopping_cart_link').click();
        await $('#checkout').click();

        await $('#first-name').setValue('John');
        await $('#last-name').setValue('Doe');
        await $('#postal-code').setValue('12345');
        await $('#continue').click();
        await $('#finish').click();

        const msg = await $('.complete-header');
        await msg.waitForDisplayed({ timeout: 5000 });
        expect(await msg.getText()).to.equal('Thank you for your order!');
    });

    it('9. Back Home returns to inventory and clears cart', async () => {
        await $('button.btn_inventory').click();
        await $('.shopping_cart_link').click();
        await $('#checkout').click();

        await $('#first-name').setValue('John');
        await $('#last-name').setValue('Doe');
        await $('#postal-code').setValue('12345');
        await $('#continue').click();
        await $('#finish').click();
        await $('#back-to-products').click();

        const currentUrl = await browser.getUrl();
        expect(currentUrl).to.include('/inventory.html');

        const cartBadge = await $('.shopping_cart_badge');
        const exists = await cartBadge.isExisting();
        expect(exists).to.be.false;
    });
});
