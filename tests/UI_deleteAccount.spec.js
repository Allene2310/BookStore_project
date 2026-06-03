import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ProfilePage } from '../pages/profilePage';




test.describe('Delete Account tests', () => {
    test.describe.configure({ mode: 'default' });
   
    let profilePage;
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        profilePage = new ProfilePage(page);

        await loginPage.navigateToLoginPage();
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        await loginPage.submitLogin();
        await expect(profilePage.page).toHaveURL('https://demoqa.com/profile');


    });

    test('TC-DEL-004: Verify that Delete Account button is visible and enabled', async () => {
        
        await expect(profilePage.deleteAccountButton).toBeVisible();
        await expect(profilePage.deleteAccountButton).toBeEnabled();

    });

    
   test('TC-DEL-002: Verify that user can cancel account deletion', async ({ page }) => {
        
        
        const modal = page.locator('.modal-content').filter({
        hasText: 'Do you want to delete your account?'
        });

        await profilePage.deleteAccountButton.click();
        await expect(modal).toBeVisible();

        const cancelButton = modal.getByRole('button', { name: 'Cancel' });
        await expect(cancelButton).toBeVisible();
        await expect(cancelButton).toBeEnabled();

        await cancelButton.click({ force: true });
        await expect(modal).toBeHidden();
        await expect(profilePage.page).toHaveURL('https://demoqa.com/profile');
        await expect(profilePage.userNameDisplay).toHaveText(loginPage.registeredUserName);

        
    });
});