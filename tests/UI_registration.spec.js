import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registrationPage';

test.describe('UI Registration Tests', () => {
    let registrationPage;

    test.beforeEach(async ({ page }) => {
        registrationPage = new RegistrationPage(page);
        await registrationPage.navigateToRegistrationForm();
    });

    test('TC004:Validation errors when empty fields are submitted', async () => {
        await registrationPage.submitRegistration();

        await expect(registrationPage.firstNameInput).toHaveClass(/is-invalid/);
        await expect(registrationPage.lastNameInput).toHaveClass(/is-invalid/);
        await expect(registrationPage.userNameInput).toHaveClass(/is-invalid/);
        await expect(registrationPage.passwordInput).toHaveClass(/is-invalid/);
    });

    test('TC012: Verify that proper labels are displayed for input fields', async () => {
        await expect(registrationPage.FirstNameLabel).toBeVisible();
        await expect(registrationPage.FirstNameLabel).toHaveText('First Name :');

        await expect(registrationPage.LastNameLabel).toBeVisible();
        await expect(registrationPage.LastNameLabel).toHaveText('Last Name :');

        await expect(registrationPage.UserNameLabel).toBeVisible();
        await expect(registrationPage.UserNameLabel).toHaveText('UserName :');

        await expect(registrationPage.PasswordLabel).toBeVisible();
        await expect(registrationPage.PasswordLabel).toHaveText('Password :');
    });

    test('TC013: Verify that proper placeholders are displayed',async () => {
        await expect(registrationPage.firstNameInput).toHaveAttribute('placeholder', 'First Name');
        await expect(registrationPage.lastNameInput).toHaveAttribute('placeholder', 'Last Name');
        await expect(registrationPage.userNameInput).toHaveAttribute('placeholder', 'UserName');
        await expect(registrationPage.passwordInput).toHaveAttribute('placeholder', 'Password');
    });


   test ('TC017: Verify that required fields are visible and editable', async () => {
        await expect(registrationPage.firstNameInput).toBeVisible();
        await expect(registrationPage.lastNameInput).toBeVisible();
        await expect(registrationPage.userNameInput).toBeVisible();
        await expect(registrationPage.passwordInput).toBeVisible();

        await expect(registrationPage.firstNameInput).toBeEditable();
        await expect(registrationPage.lastNameInput).toBeEditable();
        await expect(registrationPage.userNameInput).toBeEditable();
        await expect(registrationPage.passwordInput).toBeEditable();

    });

    test ('TC018: Verify that buttons are visible and enabled', async () => {
        await expect(registrationPage.registerButton).toBeVisible();
        await expect(registrationPage.registerButton).toBeEnabled();

        await expect(registrationPage.backToLoginButton).toBeVisible();
        await expect(registrationPage.backToLoginButton).toBeEnabled();
    });

    test ('TC014: Verify navigation to the Login page using Back To Login button', async () => {
        await registrationPage.returnToLogin();
        await expect(registrationPage.page).toHaveURL(/login/);
    });

        
});