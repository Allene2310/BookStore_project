import {expect, test} from '@playwright/test';
import {LoginPage} from '../pages/loginPage';
import {ProfilePage} from '../pages/profilePage';
import {BookStorePage} from '../pages/bookStorePage';
import {BookDetailsPage} from '../pages/bookDetailsPage';


async function cleanUp(request, userName, password) {
    const loginResponse = await request.post('https://demoqa.com/Account/v1/Login', {
        data: {
            userName,
            password
        }
    });
    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();
    const deleteResponse = await request.delete(`https://demoqa.com/BookStore/v1/Books?UserId=${loginBody.userId}`, {
        headers: {
            Authorization: `Bearer ${loginBody.token}`
        }
    });

    expect(deleteResponse.status()).toBe(204);
}

test.describe('Book Details Page Tests when user is unauthenticated', () => {

    let bookDetailsPage;

    test.beforeEach(async ({ page }) => {
        bookDetailsPage = new BookDetailsPage(page);
        const bookStorePage = new BookStorePage(page);
        await bookStorePage.navigateToBookStore();
        await bookStorePage.titleLink.nth(1).click();
    });

    test('TC-BD-001:Verify that Login displays on Book Details page when user is unauthenticated', async () => {

        await expect(bookDetailsPage.loginNavigationButton).toBeVisible();
        await expect(bookDetailsPage.loginNavigationButton).toBeEnabled();

    });

    test('TC-BD-003:Verify that book details are displayed on the Book Details page', async () => {
        await expect(bookDetailsPage.bookISBN).toBeVisible();
        await expect(bookDetailsPage.bookTitle).toBeVisible();
        await expect(bookDetailsPage.bookSubTitle).toBeVisible();
        await expect(bookDetailsPage.bookAuthor).toBeVisible();
        await expect(bookDetailsPage.bookPublisher).toBeVisible();
        await expect(bookDetailsPage.bookPages).toBeVisible();
        await expect(bookDetailsPage.bookDescription).toBeVisible();
        await expect(bookDetailsPage.bookWebsite).toBeVisible();
    });

    test('TC-BD-006: Verify that user is able to navigate to Book Store page', async () => {

        await bookDetailsPage.backToBookStoreButton.click();
        await expect(bookDetailsPage.page).toHaveURL('https://demoqa.com/books');
    });

});

test.describe('Book Details Page - External Link Tests', () => {
    test.describe.configure ({ mode: 'default' });
    let bookDetailsPage;
       

    test.beforeEach (async ({page}) => {
        bookDetailsPage = new BookDetailsPage(page);
        const bookStorePage = new BookStorePage(page);
        await bookStorePage.navigateToBookStore();
        
    });


        const bookIndex = [0, 1, 2, 3, 4, 5, 6, 7];

        for (let index of bookIndex) {
            test (`TC-BD-009:Verify external website link is not broken for book index '${index}'`, async () => {
            const bookStorePage = new BookStorePage(bookDetailsPage.page);

            await bookStorePage.titleLink.nth(index).click();
            await expect(bookDetailsPage.bookTitle).toBeVisible();

            const [newPage] = await Promise.all([
            bookDetailsPage.page.context().waitForEvent('page'),
            bookDetailsPage.bookWebsite.click()
            ]);

            await newPage.waitForLoadState();

            await expect(newPage).toHaveURL(/https?:\/\/.*/);

            const response = await bookDetailsPage.page.request.get(newPage.url());
            await expect(response.status()).not.toBe(404);
            
            await newPage.close();
            });
        
    
        };

    test('TC-BD-010:Verify that external website opens in a new tab', async () => {
        const bookStorePage = new BookStorePage(bookDetailsPage.page);
        await bookStorePage.titleLink.nth(0).click();
        await expect(bookDetailsPage.bookTitle).toBeVisible();

        const [newPage] = await Promise.all([
            bookDetailsPage.page.context().waitForEvent('page'),
            bookDetailsPage.bookWebsite.click()
        ]);
        await newPage.waitForLoadState();

        await expect(newPage).toHaveURL(/https?:\/\/.*/);
        await newPage.close();
    });
});


test.describe('Book Details Page tests when user is authenticated', () => {
    test.describe.configure({ mode: 'default' });
    let bookDetailsPage;
    let loginPage;
    let profilePage;

    test.beforeEach(async ({ page, request }) => {
        bookDetailsPage = new BookDetailsPage(page);
        loginPage = new LoginPage(page);
        await cleanUp(request, loginPage.registeredUserName, loginPage.registeredPassword);

        await loginPage.navigateToLoginPage();
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        const profileResponse = page.waitForResponse(response => 
            response.url().includes('/Account/v1/User/') && response.status() === 200
        );
        await loginPage.submitLogin();
        await profileResponse;
        
        profilePage = new ProfilePage(page);
        await profilePage.goToBookStoreButton.click();

        const bookStorePage = new BookStorePage(page);
        await bookStorePage.titleLink.nth(1).click();
    });

    test.afterEach(async ({ request }) => {
        await cleanUp(request, loginPage.registeredUserName, loginPage.registeredPassword);
    });

   

    test('TC-BD-002:Verify that Logout, Username and Add To Your Collection button are displayed', async () => {
        await expect(bookDetailsPage.logoutButton).toBeVisible();

        await expect(bookDetailsPage.userNameDisplay).toBeVisible();
        await expect(bookDetailsPage.userNameDisplay).toHaveText(loginPage.registeredUserName);

        await expect(bookDetailsPage.addToCollectionButton).toBeVisible();
        await expect(bookDetailsPage.addToCollectionButton).toBeEnabled();
    });

     test('TC-BD-004: Verify that user is able to add book to collection', async () => {
        const message = await bookDetailsPage.addBookToCollection();
        expect(message).toBe('Book added to your collection.');
            
        });

        test('TC-BD-005: Verify that user is not able to duplicate a book that was added to their collection', async () => {
            const message = await bookDetailsPage.addBookToCollection();
            expect(message).toBe('Book added to your collection.');

           const duplicateMessage = await bookDetailsPage.duplicateBookInCollection();
           expect(duplicateMessage).toBe('Book already present in the your collection!');
        });
    });


    







        



