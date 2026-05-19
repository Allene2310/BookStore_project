export class LoginPage {
    constructor(page) {
        this.page = page;
        this.loginNavigationButton = page.getByRole('button', {name: 'Login'});
        this.userNameInput = page.getByPlaceholder('UserName');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.locator('#login');
        this.errorMessage = page.locator('#name');
        this.usernameLabel = page.locator('#userName-label');
        this.passwordLabel = page.locator('#password-label');
        this.registeredUserName = 'gein123';
        this.registeredPassword = 'Geindou*123';
        this.profileUserName = page.locator('#userName-value');
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
        this.alreadyLoggedInMessage = page.locator('#loading-label');
        
    };

    async navigateToLoginPage() {
        await this.page.goto('https://demoqa.com/books');
        await this.loginNavigationButton.click();
    };

    async fillLoginForm(userName, password) {
        await this.userNameInput.fill(userName);
        await this.passwordInput.fill(password);
        };

    async submitLogin() {
        await this.loginButton.click();
    };

    


}