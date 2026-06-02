import {test, expect} from '@playwright/test';
import {BookStorePage} from '../pages/bookStorePage';
import {LoginPage} from '../pages/loginPage';
import {ProfilePage} from '../pages/profilePage';
import {Menu} from '../components/menu';

async function loginUser(loginPage) {
    await loginPage.navigateToLoginPage();
    await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
    await loginPage.submitLogin();
}

test.describe('Logout functionality tests', () => {
    test.describe.configure({ mode: 'default' });
    let bookStorePage;
    let menu;
    let loginPage;
    let profilePage;

    test.beforeEach(async ({ page }) => {
        bookStorePage = new BookStorePage(page);
        menu = new Menu(page);
        loginPage = new LoginPage(page);
        profilePage = new ProfilePage(page);
        await bookStorePage.navigateToBookStore();
    });

    test('TC-LO-001: Verify that Login changes to Logout after user authentication', async () => {
        await expect(bookStorePage.loginNavigationButton).toBeVisible();

        await loginUser(loginPage);

        await expect(loginPage.page).toHaveURL('https://demoqa.com/profile');
        await expect(profilePage.logoutButton).toBeVisible();
        
    });

    test('TC-LO-002: Verify that user is able to log out successfully', async () => {
        await loginUser(loginPage);

        await expect (loginPage.page).toHaveURL('https://demoqa.com/profile');
        await expect(profilePage.logoutButton).toBeVisible();

        await profilePage.logoutButton.click();
        await expect (profilePage.page).toHaveURL('https://demoqa.com/login');
        await expect (loginPage.loginButton).toBeVisible();

        await expect(bookStorePage.loginNavigationButton).toBeVisible();

    });

    test('TC-LO-003: Verify that the user cannot access their Profile after logout', async ({ page }) => {
        await loginUser(loginPage);
        await expect (loginPage.page).toHaveURL('https://demoqa.com/profile');
        await expect(profilePage.logoutButton).toBeVisible();

        await profilePage.logoutButton.click();
        await expect (loginPage.page).toHaveURL('https://demoqa.com/login');

        await menu.profileMenuItemLink.click();
        await expect (menu.page).toHaveURL('https://demoqa.com/profile');
        await expect(page.getByText(/Currently you are not logged into/)).toBeVisible();
        await expect(profilePage.booksTable).not.toBeVisible();
        

    });

    test('TC-LO-004: Verify that the user cannot access their Profile after logout using browser Back button', async ({ page }) => {
        await loginUser(loginPage);
        await expect (loginPage.page).toHaveURL('https://demoqa.com/profile');
        await expect(profilePage.logoutButton).toBeVisible();
        
        await profilePage.logoutButton.click();
        await expect (loginPage.page).toHaveURL('https://demoqa.com/login');

        await page.goBack();
        await expect (loginPage.page).toHaveURL('https://demoqa.com/profile');
        await expect(page.getByText(/Currently you are not logged into/)).toBeVisible();
        await expect(profilePage.booksTable).not.toBeVisible();
    });

});