import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/loginPage';
import {ProfilePage} from '../pages/profilePage';
import {BookStorePage} from '../pages/bookStorePage';


test.describe('Book Store Page Tests', () => {
    let bookStorePage;

    test.beforeEach(async ({ page }) => {
        bookStorePage = new BookStorePage(page);
        await bookStorePage.navigateToBookStore();
        await expect(bookStorePage.bookRows.first()).toBeVisible();
        
    });

    test('TC-BS-001: Verify that Login is displayed on the Book Store page when the user is unauthenticated', async () => {
        await expect(bookStorePage.loginNavigationButton).toBeVisible();
    });
        

    test('TC-BS-002: Verify that Logout and User Name are displayed on the Book Store page when the user is authenticated', async () => {
        const loginPage = new LoginPage(bookStorePage.page);
        const profilePage = new ProfilePage(bookStorePage.page);
        await loginPage.navigateToLoginPage();
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        await loginPage.submitLogin();

        await profilePage.goToBookStoreButton.click();

        await expect(bookStorePage.logoutButton).toBeVisible();

        await expect(bookStorePage.userNameDisplay).toBeVisible();
        await expect(bookStorePage.userNameDisplay).toHaveText(loginPage.registeredUserName);
        
    });


    test('TC-BS-003: Verify that books are displayed on the Book Store page', async () => {
        await expect(bookStorePage.bookTable).toBeVisible();
        const rowCount = await bookStorePage.bookRows.count();
        expect(rowCount).toBeGreaterThan(0);

        await expect(bookStorePage.bookImages.first()).toBeVisible();
        await expect(bookStorePage.bookTitles.first()).toBeVisible();
        await expect(bookStorePage.bookAuthors.first()).toBeVisible();
        await expect(bookStorePage.bookPublishers.first()).toBeVisible();
    });

    test ('TC-BS-011: Verify that Title link navigates user to Book Details page', async ()=> {
        await bookStorePage.titleLink.first().click();

        await expect(bookStorePage.page).toHaveURL(/books\?search=/);

        await expect(bookStorePage.page.getByRole('button', { name: 'Back To Book Store' })).toBeVisible();
        await expect(bookStorePage.page.getByText('ISBN: ')).toBeVisible();
    });

    test('TC-BS-013: Verify that pagination controls are visible and disabled', async () => {
        await expect(bookStorePage.previousPageButton).toBeVisible();
        await expect(bookStorePage.previousPageButton).toBeDisabled();

        await expect(bookStorePage.nextPageButton).toBeVisible();
        await expect(bookStorePage.nextPageButton).toBeDisabled();
    });

});


test.describe('Search functionality on Book Store page', () => {
    let bookStorePage;

    test.beforeEach(async ({ page }) => {
        bookStorePage = new BookStorePage(page);
        await bookStorePage.navigateToBookStore();
        await expect(bookStorePage.bookRows.first()).toBeVisible();
    });

    test('TC-BS-004: Verify that the user is able to search books by existing title, author, or publisher', async ()=>{
        await bookStorePage.searchInput.fill('script');
        const count = await bookStorePage.bookRows.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            await expect(bookStorePage.bookRows.nth(i)).toContainText(/script/i);
            
        }
    });

    test('TC-BS-005: Verify that no books are displayed when the user searches by non-existing title, author, or publisher', async () => {

        await bookStorePage.searchInput.fill('lodash');
        await expect(bookStorePage.bookRows).toHaveCount(0);
    });

    test('TC-BS-006: Verify that clearing the search field restores the full book list', async () => {
        const initialCount = await bookStorePage.bookRows.count();
        
        await bookStorePage.searchInput.fill('javascript');
        const searchResults = await bookStorePage.bookRows.count();
        expect(searchResults).toBeLessThan(initialCount);

        await bookStorePage.searchInput.clear();

        await expect(bookStorePage.bookRows).toHaveCount(initialCount);
    });

    test('TC-BS-007: Verify that the search field returns matching books regardless of entered letter case', async () => {
    
        await bookStorePage.searchInput.fill('js');
        const lowSearchedCount = await bookStorePage.bookRows.count();
        expect(lowSearchedCount).toBeGreaterThan(0);
        const lowSearchedResults = await bookStorePage.bookRows.allTextContents();

        for (let result of lowSearchedResults) {
            expect(result.toLowerCase()).toContain('js');
        }
        await bookStorePage.searchInput.clear();

        await bookStorePage.searchInput.fill('JS');
        await expect(bookStorePage.bookRows).toHaveCount(lowSearchedCount);
        const upSearchedResults = await bookStorePage.bookRows.allTextContents();

        for (let result of upSearchedResults) {
            expect(result.toUpperCase()).toContain('JS');
        }

        expect(upSearchedResults).toEqual(lowSearchedResults);
    });

});

test.describe('Sorting functionality on Book Store page', () => {
    let bookStorePage;

    test.beforeEach(async ({ page }) => {
        bookStorePage = new BookStorePage(page);
        await bookStorePage.navigateToBookStore();
        await expect(bookStorePage.bookRows.first()).toBeVisible();
    });

    test('TC-BS-008: Verify that the user is able to sort books by Title header', async () => {
        const initialTitles = await bookStorePage.bookTitles.allTextContents();
        
        await bookStorePage.sortTitleButton.click();
        const ascTitles = await bookStorePage.bookTitles.allTextContents();
        const ascSortedTitles = [...ascTitles].sort((a, b) => a.localeCompare(b));
        expect(ascTitles).toEqual(ascSortedTitles);
        await expect(bookStorePage.ascArrow).toBeVisible();

        await bookStorePage.sortTitleButton.click();
        const descTitles = await bookStorePage.bookTitles.allTextContents();
        const descSortedTitles = [...descTitles].sort((a, b) => b.localeCompare(a));
        expect(descTitles).toEqual(descSortedTitles);
        await expect(bookStorePage.descArrow).toBeVisible();

        await bookStorePage.sortTitleButton.click();
        const unsortedTitles = await bookStorePage.bookTitles.allTextContents();
        expect(unsortedTitles).toEqual(initialTitles);

    });

    test('TC-BS-009: Verify that the user is able to sort books by Author header', async () => {
        const initialAuthors = await bookStorePage.bookAuthors.allTextContents();

        await bookStorePage.sortAuthorButton.click();
        const ascAuthors = await bookStorePage.bookAuthors.allTextContents();
        const ascSortedAuthors = [...ascAuthors].sort((a, b) => a.localeCompare(b));
        expect(ascAuthors).toEqual(ascSortedAuthors);
        await expect(bookStorePage.ascArrow).toBeVisible();

        await bookStorePage.sortAuthorButton.click();
        const descAuthors = await bookStorePage.bookAuthors.allTextContents();
        const descSortedAuthors = [...descAuthors].sort((a, b) => b.localeCompare(a));
        expect(descAuthors).toEqual(descSortedAuthors);
        await expect(bookStorePage.descArrow).toBeVisible();

        await bookStorePage.sortAuthorButton.click();
        const unsortedAuthors = await bookStorePage.bookAuthors.allTextContents();
        expect(unsortedAuthors).toEqual(initialAuthors);
    });

    test('TC-BS-010: Verify that the user is able to sort books by Publisher header', async () => {
        const initialPublishers = await bookStorePage.bookPublishers.allTextContents();

        await bookStorePage.sortPublisherButton.click();
        const ascPublishers = await bookStorePage.bookPublishers.allTextContents();
        const ascSortedPublishers = [...ascPublishers].sort((a, b) => a.localeCompare(b));
        expect(ascPublishers).toEqual(ascSortedPublishers);
        await expect(bookStorePage.ascArrow).toBeVisible();

        await bookStorePage.sortPublisherButton.click();
        const descPublishers = await bookStorePage.bookPublishers.allTextContents();
        const descSortedPublishers = [...descPublishers].sort((a, b) => b.localeCompare(a));
        expect(descPublishers).toEqual(descSortedPublishers);
        await expect(bookStorePage.descArrow).toBeVisible();

        await bookStorePage.sortPublisherButton.click();
        const unsortedPublishers = await bookStorePage.bookPublishers.allTextContents();
        expect(unsortedPublishers).toEqual(initialPublishers);
    });

});

