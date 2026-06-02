import {expect, test} from '@playwright/test';
import {BookStorePage} from '../pages/bookStorePage';
import {LoginPage} from '../pages/loginPage';
import {ProfilePage} from '../pages/profilePage';
import {Menu} from '../components/menu';

test.describe('Book Store Application menu tests', () => {
    let bookStorePage;
    let menu;

    test.beforeEach(async ({ page }) => {
        bookStorePage = new BookStorePage(page);
        menu = new Menu(page);
        await bookStorePage.navigateToBookStore();
       

    });

    test('TC-BSM-001: Verify that Book Store Application menu is visible, clickable and displays all menu items', async () => {
        await expect(menu.menuHeader).toBeVisible();
        await expect(menu.menuDropdownButton).toBeVisible();
        await expect(menu.menuDropdownButton).toBeEnabled();
        await expect(menu.menuList).toBeVisible();
        await expect(menu.menuItems).toHaveCount(4);
        await expect(menu.menuItems).toHaveText(['Login', 'Book Store', 'Profile', 'Book Store API']);

        await menu.menuDropdownButton.click();
        await expect(menu.menuHeader).toBeVisible();
        await expect(menu.menuDropdownButton).toBeVisible();
        await expect(menu.menuList).not.toBeVisible();
    })

    test('TC-BSM-002: Verify that user is able to navigate to Login page using Book Store Application menu', async () => {
        
        await menu.loginMenuItemLink.click();
        await expect(menu.page).toHaveURL('https://demoqa.com/login');
    });

    test('TC-BSM-003: Verify that user is able to navigate to Book Store page using Book Store Application menu', async () => {
        await menu.bookStoreMenuItemLink.click();
        await expect(menu.page).toHaveURL('https://demoqa.com/books');
    });

    test('TC-BSM-004: Verify that user is able to navigate to Profile page using Book Store Application menu', async () => {
        const loginPage = new LoginPage(menu.page);
        const profilePage = new ProfilePage(menu.page);
        await loginPage.navigateToLoginPage();
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        await loginPage.submitLogin();
        await profilePage.goToBookStoreButton.click();
        await menu.profileMenuItemLink.click();
        await expect(menu.page).toHaveURL('https://demoqa.com/profile');

    });

    test('TC-BSM-005: Verify that user is able to navigate to Book Store API page using Book Store Application menu', async () => {
        await menu.bookStoreAPIMenuItemLink.click();
        await expect(menu.page).toHaveURL('https://demoqa.com/swagger');
    });

    test('TC-BSM-006: Verify that Book Store Application menu persists across Book Store application pages', async () => {
        const loginPage = new LoginPage(menu.page);
        const profilePage = new ProfilePage(menu.page);
        await loginPage.navigateToLoginPage();
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        await loginPage.submitLogin();
        await profilePage.goToBookStoreButton.click();

        await test.step('Verify menu on Login page', async () => {
            await menu.loginMenuItemLink.click();
            await expect(menu.page).toHaveURL('https://demoqa.com/login');
            await expect(menu.menuDropdownButton).toBeVisible();
            await expect(menu.menuHeader).toBeVisible();
            await expect(menu.menuList).toBeVisible();
            await expect(menu.menuItems).toHaveCount(4);

        });

        await test.step('Verify menu on Book Store page', async () => {
            
            await menu.bookStoreMenuItemLink.click();
            await expect(menu.page).toHaveURL('https://demoqa.com/books');

            await expect(menu.menuDropdownButton).toBeVisible();
            await expect(menu.menuHeader).toBeVisible();
            await expect(menu.menuList).toBeVisible();
            await expect(menu.menuItems).toHaveCount(4);
        });

        await test.step('Verify menu on Profile page', async () => {
            
            await menu.profileMenuItemLink.click();
            await expect(menu.page).toHaveURL('https://demoqa.com/profile');
            await expect(menu.menuDropdownButton).toBeVisible();
            await expect(menu.menuHeader).toBeVisible();
            await expect(menu.menuList).toBeVisible();
            await expect(menu.menuItems).toHaveCount(4);
        }); 

        await test.step('Verify menu on Book Store Book Details page', async () => {
            await menu.bookStoreMenuItemLink.click();
            await bookStorePage.titleLink.first().click();
            await expect(menu.page).toHaveURL(/books\?search=/);
            await expect(menu.menuDropdownButton).toBeVisible();
            await expect(menu.menuHeader).toBeVisible();
            await expect(menu.menuList).toBeVisible();
            await expect(menu.menuItems).toHaveCount(4);
        });


    });


    test('TC-BSM-008: Verify that tab key navigates menu items in correct order', async () => {
       
        await menu.loginMenuItemLink.focus();
        await expect(menu.loginMenuItemLink).toBeFocused();

        await menu.page.keyboard.press('Tab');
        await expect(menu.bookStoreMenuItemLink).toBeFocused();

        await menu.page.keyboard.press('Tab');
        await expect(menu.profileMenuItemLink).toBeFocused();

        await menu.page.keyboard.press('Tab');
        await expect(menu.bookStoreAPIMenuItemLink).toBeFocused();
    });

});
test.describe('Book Store Application menu - responsive', () => {
    test.use({ viewport: { width: 412, height: 914 } });
    

    test('TC-BSM-007: Verify responsive behavior on smaller screens', async ({page}) => {
        
        const bookStorePage = new BookStorePage(page);
        const menu = new Menu(page);
        await bookStorePage.navigateToBookStore();

        await expect(menu.navigationMenuButton).toBeVisible();
        await menu.navigationMenuButton.click();

        await expect(menu.loginMenuItemLink).toBeVisible();
        await expect(menu.bookStoreMenuItemLink).toBeVisible();
        await expect(menu.profileMenuItemLink).toBeVisible();
        await expect(menu.bookStoreAPIMenuItemLink).toBeVisible();
    });
        
});


