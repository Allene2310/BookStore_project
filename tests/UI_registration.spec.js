import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registrationPage';

test.describe('UI Registration Tests', () => {
    let registrationPage;

    test.beforeEach(async ({ page }) => {
        registrationPage = new RegistrationPage(page);
        await registrationPage.navigateToRegistrationForm();
    });

    test('TC-REG-001: Verify the access to the Register form from the Book Store page', async ({ page }) => {
    
        await expect(page).toHaveURL(/register/);
        await expect(registrationPage.registerButton).toBeVisible();
});

    test('TC-REG-004: Validation errors when empty fields are submitted', async () => {
        await registrationPage.submitRegistration();

        await expect(registrationPage.firstNameInput).toHaveClass(/is-invalid/);
        await expect(registrationPage.lastNameInput).toHaveClass(/is-invalid/);
        await expect(registrationPage.userNameInput).toHaveClass(/is-invalid/);
        await expect(registrationPage.passwordInput).toHaveClass(/is-invalid/);
    });

    test('TC-REG-012: Verify that proper labels are displayed for input fields', async () => {
        await expect(registrationPage.firstNameLabel).toBeVisible();
        await expect(registrationPage.firstNameLabel).toHaveText('First Name :');

        await expect(registrationPage.lastNameLabel).toBeVisible();
        await expect(registrationPage.lastNameLabel).toHaveText('Last Name :');

        await expect(registrationPage.userNameLabel).toBeVisible();
        await expect(registrationPage.userNameLabel).toHaveText('UserName :');

        await expect(registrationPage.passwordLabel).toBeVisible();
        await expect(registrationPage.passwordLabel).toHaveText('Password :');
    });

    test('TC-REG-013: Verify that proper placeholders are displayed',async () => {
        await expect(registrationPage.firstNameInput).toHaveAttribute('placeholder', 'First Name');
        await expect(registrationPage.lastNameInput).toHaveAttribute('placeholder', 'Last Name');
        await expect(registrationPage.userNameInput).toHaveAttribute('placeholder', 'UserName');
        await expect(registrationPage.passwordInput).toHaveAttribute('placeholder', 'Password');
    });


   test ('TC-REG-015: Verify that Register page fields and buttons are visible and accessible', async () => {
        await test.step ('Verify that input fields are visible and editable', async () => {
            await expect(registrationPage.firstNameInput).toBeVisible();
            await expect(registrationPage.lastNameInput).toBeVisible();
            await expect(registrationPage.userNameInput).toBeVisible();
            await expect(registrationPage.passwordInput).toBeVisible();

            await expect(registrationPage.firstNameInput).toBeEditable();
            await expect(registrationPage.lastNameInput).toBeEditable();
            await expect(registrationPage.userNameInput).toBeEditable();
            await expect(registrationPage.passwordInput).toBeEditable();
        });

        await test.step ('Verify that buttons are visible and enabled', async () => {
            await expect(registrationPage.registerButton).toBeVisible();
            await expect(registrationPage.registerButton).toBeEnabled();

            await expect(registrationPage.backToLoginButton).toBeVisible();
            await expect(registrationPage.backToLoginButton).toBeEnabled();
        });

    });

    test ('TC-REG-014: Verify navigation to the Login page using Back To Login button', async () => {
        await registrationPage.returnToLogin();
        await expect(registrationPage.page).toHaveURL(/login/);
    });

    test('TC-REG-016: Verify that Tab key navigates fields in correct order', async () => {
        await registrationPage.pressTab();
        await expect(registrationPage.firstNameInput).toBeFocused();

        await registrationPage.pressTab();
        await expect(registrationPage.lastNameInput).toBeFocused();

        await registrationPage.pressTab();
        await expect(registrationPage.userNameInput).toBeFocused();

        await registrationPage.pressTab();
        await expect(registrationPage.passwordInput).toBeFocused();

        await registrationPage.pressTab();
        await expect(registrationPage.registerButton).toBeFocused();

        await registrationPage.pressTab();
        await expect(registrationPage.backToLoginButton).toBeFocused();
    });

    test('TC-REG-017: Verify that entered password is masked in the Password field', async () => {
        await registrationPage.passwordInput.fill('Geindou*123');

        await expect(registrationPage.passwordInput).toHaveAttribute('type', 'password');
    });


});