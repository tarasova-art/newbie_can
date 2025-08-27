class LoginPage {
    get usernameInput() { return $('#user-name'); }
    get passwordInput() { return $('#password'); }
    get loginBtn() { return $('#login-button'); }

    async open() {
        await browser.url('https://www.saucedemo.com/');
    }

    async login(username = 'standard_user', password = 'secret_sauce') {
        await this.usernameInput.setValue(username);
        await this.passwordInput.setValue(password);
        await this.loginBtn.click();
    }
}

module.exports = new LoginPage();
