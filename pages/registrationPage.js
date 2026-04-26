export class RegistrationPage {
    constructor(page) {
        this.page = page;
        this.accountButton = page.getByRole('button', {name: 'Login'});
        this.newUserButton = page.getByRole('button', {name: 'New User'});
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.userNameInput = page.getByPlaceholder('UserName');
        this.passwordInput = page.getByPlaceholder('Password');
        this.registerButton = page.locator('#register');
        this.backToLoginButton = page.locator('#gotologin');
        this.uniqueUserName = `jein${Date.now()}`;
        this.FirstNameLabel = page.locator('#firstname-label');
        this.LastNameLabel = page.locator('#lastname-label');
        this.UserNameLabel = page.locator('#userName-label');
        this.PasswordLabel = page.locator('#password-label');
    };

    async navigateToRegistrationForm() {
        await this.page.goto('https://demoqa.com/books');
        await this.accountButton.click();
        await this.newUserButton.click();
    };

    async fillRegistrationForm(firstName, lastName, userName, password) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.userNameInput.fill(userName);
        await this.passwordInput.fill(password);
    };

    async submitRegistration() {
        await this.registerButton.click();
    };

    async returnToLogin() {
        await this.backToLoginButton.click();
    }

    

}