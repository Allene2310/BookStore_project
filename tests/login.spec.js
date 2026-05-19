import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/loginPage';


test.describe('Login Tests', () => {
    let loginPage;
        
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
    });

    test('TC-LI-001: Verify that user can access the Login page from the Book Store page', async () => {
        await expect(loginPage.page).toHaveURL(/login/);
        await expect (loginPage.userNameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
    })

    test('TC-LI-002: Login with valid data', async () => {
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        await loginPage.submitLogin();

        await expect(loginPage.page).toHaveURL(/profile/);
        await expect(loginPage.profileUserName).toHaveText(loginPage.registeredUserName);
        await expect(loginPage.logoutButton).toBeVisible();

    });

    test('TC-LI-003: Validate error message for empty required fields', async () => {
        await loginPage.submitLogin();

        await expect(loginPage.userNameInput).toHaveClass(/is-invalid/);
        await expect(loginPage.passwordInput).toHaveClass(/is-invalid/);
    });

    test('TC-LI-004: Login with invalid username and password', async () => {
        await loginPage.fillLoginForm('gein159', 'Geindou/123');
        await loginPage.submitLogin();

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText('Invalid username or password!');
    });

    test('TC-LI-005: Login with invalid username and valid password', async () => {
        await loginPage.fillLoginForm('gein159', loginPage.registeredPassword);
        await loginPage.submitLogin();

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText('Invalid username or password!');
    });

    test('TC-LI-006: Login with valid username and invalid password', async () => {
        const invalidPasswords = ['Geindou/123', 'Geindou*122', 'geindou*123'];
            for (const password of invalidPasswords) {
                await test.step(`Invalid password: ${password}`, async () => {
                    await loginPage.fillLoginForm(loginPage.registeredUserName, password);
                    await loginPage.submitLogin();

                    await expect(loginPage.errorMessage).toBeVisible();
                    await expect(loginPage.errorMessage).toHaveText('Invalid username or password!');
                    await loginPage.page.reload();
                });
            };
    });

    test('TC-LI-007: Verify that labels for input fields are displayed correctly', async () => {
        await expect(loginPage.usernameLabel).toBeVisible();
        await expect(loginPage.usernameLabel).toHaveText('UserName :');
        await expect(loginPage.passwordLabel).toBeVisible();
        await expect(loginPage.passwordLabel).toHaveText('Password :');
    });

    test('TC-LI-008: Verify that proper placeholders are displayed',async () => {
        await expect(loginPage.userNameInput).toHaveAttribute('placeholder', 'UserName');
        await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');

    });

    test ('TC-LI-009: Verify that page elements are visible and editable', async () => {
        await test.step ('Verify that input fields are visible and editable', async() => {
            await expect(loginPage.userNameInput).toBeVisible();
            await expect(loginPage.passwordInput).toBeVisible();

            await expect(loginPage.userNameInput).toBeEditable();
            await expect(loginPage.passwordInput).toBeEditable();
        });

        await test.step ('Verify that Login button is visible and enabled', async () => {
            await expect(loginPage.loginButton).toBeVisible();
            await expect(loginPage.loginButton).toBeEnabled();
        });
    });

    test ('TC-LI-011: Verify Logging into the Application and browsing back using Browser back button ', async () => {
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        await loginPage.submitLogin();  

        await expect(loginPage.page).toHaveURL(/profile/);

        await loginPage.page.goBack();  

        await expect(loginPage.page).toHaveURL(/login/);

        await expect(loginPage.alreadyLoggedInMessage).toBeVisible();
        await expect(loginPage.alreadyLoggedInMessage).toContainText('You are already logged in. View your profile.');
    });

    test ('TC-LI-012: Verify that entered password is masked', async () => {
        await loginPage.passwordInput.fill('Geindou*123');
        await expect (loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

});

