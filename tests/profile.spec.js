import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ProfilePage } from '../pages/profilePage';


let profilePage;
let loginPage;

async function goToProfile(page) {
    if (!page.url().includes('/profile')) {
        await page.getByRole('link', { name: 'Profile' }).click();
    }
}

async function deleteAllBooksAPI(request, userName, password) {
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

async function cleanUp(profilePage, loginPage, request) {
    await goToProfile(profilePage.page);

    if (await profilePage.bookRows.count() > 0) {
        await deleteAllBooksAPI(request, loginPage.registeredUserName, loginPage.registeredPassword);
    }
}




test.describe('Profile Tests', () => {
    test.describe.configure({ mode: 'default' }); 
    let profile;
    
    

    test.beforeEach(async ({ page, request }) => {
        profilePage = new ProfilePage(page);
        loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);

        const profileResponse = page.waitForResponse(response => 
            response.url().includes('/Account/v1/User/') && response.status() === 200
        );

        await loginPage.submitLogin();
        profile = await (await profileResponse).json();
        await cleanUp(profilePage, loginPage, request);
    });

    test.afterEach(async ({ request }) => {
        
        await cleanUp (profilePage, loginPage, request);
        await profilePage.logoutButton.click();

    });

    test('TC-PR-001: Verify that Profile page is empty after first authentication', async () => {
        
        await expect(profilePage.bookRows).toHaveCount(0);

    });

    test('TC-PR-002: Verify that username and logout button is displayed on Profile page', async () => {
        
        await expect(profilePage.userNameDisplay).toBeVisible();
        await expect(profilePage.userNameDisplay).toHaveText(profile.username);

        await expect(profilePage.logoutButton).toBeVisible();
        await expect(profilePage.logoutButton).toBeEnabled();
    });

    test('TC-PR-003: Verify that user is able to navigate to Book Store', async () => {
        
        await expect(profilePage.goToBookStoreButton).toBeVisible();
        await profilePage.goToBookStoreButton.click();

        await expect(profilePage.page).toHaveURL(/books/);

    });

    test('TC-PR-004: Verify that added books displays on the Profile page.', async () => {
        
        await profilePage.goToBookStoreButton.click();
        await profilePage.addBooksToCollection(['Git Pocket Guide']);

        await expect(profilePage.bookRows).toHaveCount(1);
        await expect(profilePage.bookRows.first()).toContainText('Git Pocket Guide');

    });

    test ('TC-PR-007: Verify that user is able to delete a single book', async () => {
        await profilePage.goToBookStoreButton.click();

        await profilePage.addBooksToCollection(['Speaking JavaScript', "You Don't Know JS", 'Understanding ECMAScript 6']);
        await expect(profilePage.bookRows).toHaveCount(3);

        await profilePage.deleteBookFromCollection('Speaking JavaScript');

        await expect(profilePage.bookRows.filter({ hasNotText: 'Speaking JavaScript' })).toHaveCount(2);
        
    });
    
    test('TC-PR-008: Verify that user can cancel deleting a book from collection', async () => {
        await profilePage.goToBookStoreButton.click();

        await profilePage.addBooksToCollection(['Git Pocket Guide']);
        await expect(profilePage.bookRows).toHaveCount(1);

        await profilePage.cancelDeleteBookFromCollection('Git Pocket Guide');
        await expect(profilePage.bookRows).toHaveCount(1);
        await expect(profilePage.bookRows.filter({ hasText: 'Git Pocket Guide' })).toHaveCount(1);

    });

    test('TC-PR-009: Verify that user is able to delete all books from collection', async () => {
        await profilePage.goToBookStoreButton.click();

        await profilePage.addBooksToCollection(['Git Pocket Guide', 'Speaking JavaScript']);
        await expect(profilePage.bookRows).toHaveCount(2);

        await profilePage.deleteAllBooksFromCollection();
        await expect(profilePage.bookRows).toHaveCount(0);

    });


    test('TC-PR-010: Verify that user can cancel deleting all books from collection', async () => {
        await profilePage.goToBookStoreButton.click();

        await profilePage.addBooksToCollection(['Git Pocket Guide', 'Speaking JavaScript']);
        await expect(profilePage.bookRows).toHaveCount(2);

        await profilePage.cancelDeleteAllBooksFromCollection();
        await expect(profilePage.bookRows).toHaveCount(2);

        await expect(profilePage.bookRows.filter({ hasText: 'Git Pocket Guide' })).toHaveCount(1);
        await expect(profilePage.bookRows.filter({ hasText: 'Speaking JavaScript' })).toHaveCount(1);
    });

    test('TC-PR-012: Verify pagination controls visible and disabled', async ({ page }) => {
        await expect(profilePage.previousPageButton).toBeVisible();
        await expect(profilePage.previousPageButton).toBeDisabled();

        await expect(profilePage.nextPageButton).toBeVisible();
        await expect(profilePage.nextPageButton).toBeDisabled();
    });

    test('TC-PR-013: Verify that collection of books is stored after user logs out and logs in again ', async ({ page }) => {
        await profilePage.goToBookStoreButton.click();

        await profilePage.addBooksToCollection(['Git Pocket Guide', 'Speaking JavaScript']);
        await expect(profilePage.bookRows).toHaveCount(2);
        await profilePage.logoutButton.click();

        await expect(page).toHaveURL(/login/);
        loginPage = new LoginPage(page);
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        await loginPage.submitLogin();

        await expect(profilePage.bookRows).toHaveCount(2);
        await expect(profilePage.bookRows.filter({ hasText: 'Git Pocket Guide' })).toHaveCount(1);
        await expect(profilePage.bookRows.filter({ hasText: 'Speaking JavaScript' })).toHaveCount(1);
        
    });

    test('TC-PR-017: Verify that Title link navigates user to Book Details page', async () => {
        await profilePage.goToBookStoreButton.click();

        await profilePage.addBooksToCollection(['Git Pocket Guide']);
        await expect(profilePage.bookRows).toHaveCount(1);

        await profilePage.bookLink.first().click();
        await expect(profilePage.page).toHaveURL(/books\?search=/);
        await expect(profilePage.addToCollectionButton).toBeVisible();
        await expect(profilePage.backToBookStoreButton).toBeVisible();
    });

});

test.describe('Navigation without login', () => {
    test.describe.configure({ mode: 'default' });

    test.beforeEach(async ({ page }) => {
        await page.goto('https://demoqa.com/books');
    });
        
    test('TC-PR-011:Verify that user is not able navigate to the Profile page without login', async ({page}) => {
            await page.getByRole('link', { name: 'Profile' }).click();

            await expect(page).toHaveURL(/profile/);
            await expect(page.locator('#notLoggin-label')).toContainText('Currently you are not logged into');

        })
    }); 


test.describe('Search functionality on Profile page', () => {
    test.describe.configure({ mode: 'default' }); 


    test.beforeEach(async ({ page}) => {

        profilePage = new ProfilePage(page);
        loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        await loginPage.submitLogin();
       

    });

    test.afterEach(async ({request}) => {
        await cleanUp(profilePage, loginPage, request);
        await profilePage.logoutButton.click();
    });


    test('TC-PR-005: Verify that user can search for a book in the collection', async () => {

        await profilePage.goToBookStoreButton.click();
        await profilePage.addBooksToCollection(['Git Pocket Guide', 'Speaking JavaScript', 'Learning JavaScript Design Patterns']);
        await expect(profilePage.bookRows).toHaveCount(3);
        
        await profilePage.searchInput.type('java');

        const count = await profilePage.bookRows.count();

        for (let i = 0; i < count; i++) {
        await expect(profilePage.bookRows.nth(i)).toContainText(/java/i);
        };
        
    });

    test('TC-PR-006: Verify that no books are displayed if user enters the non-existing title, author or publisher in the searching field', async() => {    
        await profilePage.goToBookStoreButton.click();
        await profilePage.addBooksToCollection(['Git Pocket Guide', 'Speaking JavaScript', 'Learning JavaScript Design Patterns']);
        await expect(profilePage.bookRows).toHaveCount(3);

        await profilePage.searchInput.type('pyton');

        await expect(profilePage.bookRows).toHaveCount(0);
        
    });

    test ('TC-PR-015: Verify that clearing the search field restores the full book collection.', async() => {
        await profilePage.goToBookStoreButton.click();
        await profilePage.addBooksToCollection(['Git Pocket Guide', 'Speaking JavaScript', 'Learning JavaScript Design Patterns']);
        await expect(profilePage.bookRows).toHaveCount(3);

        await profilePage.searchInput.type('git');
        await expect(profilePage.bookRows).toHaveCount(1);

        await profilePage.searchInput.clear();
        await expect(profilePage.bookRows).toHaveCount(3);
    }); 

    test('TC-PR-016: Verify that the search field returns matching books regardless of entered letter case.', async() => {
        await profilePage.goToBookStoreButton.click();
        await profilePage.addBooksToCollection(['Git Pocket Guide', 'Speaking JavaScript', 'Learning JavaScript Design Patterns']);
        await expect(profilePage.bookRows).toHaveCount(3);

        await profilePage.searchInput.fill('git');
        await expect(profilePage.bookRows).toHaveCount(1);

        await profilePage.searchInput.clear();

        await profilePage.searchInput.fill('GIT');
        await expect(profilePage.bookRows).toHaveCount(1);
    });

});


test.describe('Sort functionality on Profile page', () => {
    test.describe.configure({ mode: 'default' });



    test.beforeEach(async ({ page }) => {
        profilePage = new ProfilePage(page);
        loginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();
        await loginPage.fillLoginForm(loginPage.registeredUserName, loginPage.registeredPassword);
        await loginPage.submitLogin();
        
    });

    test.afterEach(async ({ request }) => {
        await cleanUp (profilePage, loginPage, request);
        await profilePage.logoutButton.click();
    });

    test('TC-PR-019: Verify that user can sort books in the collection by Title', async () => {
        
        await profilePage.goToBookStoreButton.click();
        await profilePage.addBooksToCollection(['Git Pocket Guide', 'Speaking JavaScript', 'Learning JavaScript Design Patterns']);
        await expect(profilePage.bookRows).toHaveCount(3);

        const initialTitles = await profilePage.bookTitles.allTextContents();

        await profilePage.sortTitleButton.click();
        const asctitles = await profilePage.bookTitles.allTextContents();
        const ascSortedTitles = [...asctitles].sort((a, b) => a.localeCompare(b));
        expect(asctitles).toEqual(ascSortedTitles);
        await expect(profilePage.ascarrow).toBeVisible();


        await profilePage.sortTitleButton.click();
        const descTitles = await profilePage.bookTitles.allTextContents();
        const descSortedTitles = [...descTitles].sort((a, b) => b.localeCompare(a));
        expect(descTitles).toEqual(descSortedTitles);
        await expect(profilePage.descarrow).toBeVisible();

        await profilePage.sortTitleButton.click();
        const restoredTitles = await profilePage.bookTitles.allTextContents();
        expect(restoredTitles).toEqual(initialTitles);


    });

    test('TC-PR-020: Verify that user can sort books in the collection by Author', async () => {
        
        await profilePage.goToBookStoreButton.click();
        await profilePage.addBooksToCollection(['Git Pocket Guide', 'Speaking JavaScript', 'Understanding ECMAScript 6']);
        await expect(profilePage.bookRows).toHaveCount(3);

        const initialAuthors = await profilePage.bookAuthors.allTextContents();

        await profilePage.sortAuthorButton.click();
        const ascAuthors = await profilePage.bookAuthors.allTextContents();
        const ascSortedAuthors = [...ascAuthors].sort((a, b) => a.localeCompare(b));
        expect(ascAuthors).toEqual(ascSortedAuthors);
        await expect(profilePage.ascarrow).toBeVisible();

        await profilePage.sortAuthorButton.click();
        const descAuthors = await profilePage.bookAuthors.allTextContents();
        const descSortedAuthors = [...descAuthors].sort((a, b) => b.localeCompare(a));
        expect(descAuthors).toEqual(descSortedAuthors);
        await expect(profilePage.descarrow).toBeVisible();

        await profilePage.sortAuthorButton.click();
        const restoredAuthors = await profilePage.bookAuthors.allTextContents();
        expect(restoredAuthors).toEqual(initialAuthors);
    });

    test('TC-PR-021: Verify that user can sort books in the collection by Publisher', async () => {
        
        await profilePage.goToBookStoreButton.click();
        await profilePage.addBooksToCollection(['Git Pocket Guide', 'Speaking JavaScript', 'Understanding ECMAScript 6']);
        await expect(profilePage.bookRows).toHaveCount(3);

        const initialPublishers = await profilePage.bookPublishers.allTextContents();

        await profilePage.sortPublisherButton.click();
        const ascPublishers = await profilePage.bookPublishers.allTextContents();
        const ascSortedPublishers = [...ascPublishers].sort((a, b) => a.localeCompare(b));
        expect(ascPublishers).toEqual(ascSortedPublishers);
        await expect(profilePage.ascarrow).toBeVisible();

        await profilePage.sortPublisherButton.click();
        const descPublishers = await profilePage.bookPublishers.allTextContents();
        const descSortedPublishers = [...descPublishers].sort((a, b) => b.localeCompare(a));
        expect(descPublishers).toEqual(descSortedPublishers);
        await expect(profilePage.descarrow).toBeVisible();

        await profilePage.sortPublisherButton.click();
        const restoredPublishers = await profilePage.bookPublishers.allTextContents();
        expect(restoredPublishers).toEqual(initialPublishers);
    });
    

});


        





    

