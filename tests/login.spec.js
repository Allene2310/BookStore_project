import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/loginPage';


test.describe('Login Tests', () => {
    let loginPage;
        

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
    });

    test('TC002: Login with valid data', async () => {
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        await loginPage.submitLogin();

        await expect(loginPage.page).toHaveURL(/profile/);
    });

    test('TC003: Validate error message for empty required fields', async () => {
        await loginPage.submitLogin();

        await expect(loginPage.userNameInput).toHaveClass(/is-invalid/);
        await expect(loginPage.passwordInput).toHaveClass(/is-invalid/);
    });

    test('TC004: Login with invalid data in required fields', async () => {
        await loginPage.fillLoginForm('gein12*', 'Geindou/123');
        await loginPage.submitLogin();

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText('Invalid username or password!');
    });

    test('TC005: Login with invalid data in UserName fields', async () => {
        await loginPage.fillLoginForm('gein12*', loginPage.registeredPassword);
        await loginPage.submitLogin();

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText('Invalid username or password!');
    });

    test('TC006: Login with invalid data in Password fields', async () => {
        await loginPage.fillLoginForm(loginPage.registeredUserName, 'Geindou/123');
        await loginPage.submitLogin();

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText('Invalid username or password!');
    });

    test('TC007: Verify that labels for input fields are displayed correctly', async () => {
        await expect(loginPage.usernameLabel).toBeVisible();
        await expect(loginPage.usernameLabel).toHaveText('UserName :');
        await expect(loginPage.passwordLabel).toBeVisible();
        await expect(loginPage.passwordLabel).toHaveText('Password :');
    });

    test('TC008: Verify that proper placeholders are displayed',async () => {
        await expect(loginPage.userNameInput).toHaveAttribute('placeholder', 'UserName');
        await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');
    });

    test ('TC009: Verify that required fields are visible and editable', async () => {
        await expect(loginPage.userNameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();

        await expect(loginPage.userNameInput).toBeEditable();
        await expect(loginPage.passwordInput).toBeEditable();
    });

    test ('TC010: Verify that Login button is visible and enabled', async () => {
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.loginButton).toBeEnabled();
    });

    test ('TC011: Verify Logging into the Application and browsing back using Browser back button ', async () => {
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        await loginPage.submitLogin();  

        await expect(loginPage.page).toHaveURL(/profile/);

        await loginPage.page.goBack();  

        await expect(loginPage.page).toHaveURL(/login/);

        const alreadyLoggedInMessage = loginPage.page.locator('#loading-label');
        await expect(alreadyLoggedInMessage).toBeVisible();
        await expect(alreadyLoggedInMessage).toContainText('You are already logged in. View your profile.');
    });

});