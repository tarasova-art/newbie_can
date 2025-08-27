class CheckoutPage {
    get firstNameInput() { return $('#first-name'); }
    get lastNameInput() { return $('#last-name'); }
    get postalCodeInput() { return $('#postal-code'); }
    get continueBtn() { return $('#continue'); }
    get finishBtn() { return $('#finish'); }
    get confirmMsg() { return $('.complete-header'); }
    get summaryInfo() { return $('.summary_info'); }
    get backHomeBtn() { return $('#back-to-products'); }

    async fillCheckoutForm(first = 'Tuesday', last = 'Claassen', postal = '12345') {
        await this.firstNameInput.setValue(first);
        await this.lastNameInput.setValue(last);
        await this.postalCodeInput.setValue(postal);
        await this.continueBtn.click();
    }

     async summary() {
        await this.summaryInfo.isDisplayed()
    }

    async finishOrder() {
        await this.finishBtn.click();
    }

    async getConfirmMessage() {
        return await this.confirmMsg.getText();
    }

    async backHome() {
        await this.backHomeBtn.click();
    }
}

module.exports = new CheckoutPage();
