export class ProfilePage {
    constructor(page) {
        this.page = page;
        this.userNameDisplay = page.locator('#userName-value');
        this.booksTable = page.getByRole('table');
        this.bookRows = this.booksTable.locator('tbody tr');
        this.goToBookStoreButton = page.getByRole('button', { name: 'Go To Book Store' });
        this.bookLink = page.locator('.action-buttons a');
        this.addToCollectionButton = page.getByRole('button', { name: 'Add To Your Collection' });
        this.backToBookStoreButton = page.getByRole('button', { name: 'Back To Book Store' });
        this.deleteBookButton = page.getByRole('button', { name: 'Delete' });
        this.confirmOkButton = page.locator('#closeSmallModal-ok');
        this.confirmCancelButton = page.locator('#closeSmallModal-cancel');
        this.deleteAllBooksButton = page.getByRole('button', { name: 'Delete All Books' });
        this.previousPageButton = page.getByRole('button', { name: 'Previous' });
        this.nextPageButton = page.getByRole('button', { name: 'Next' });
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
        this.searchInput = page.getByRole('textbox', { name: 'Type to search' });
        this.sortTitleButton = page.getByRole('columnheader', { name: 'Title' });
        this.sortAuthorButton = page.getByRole('columnheader', { name: 'Author' });
        this.sortPublisherButton = page.getByRole('columnheader', { name: 'Publisher' });
        this.bookTitles = this.bookRows.locator('td:nth-child(2)')
        this.bookAuthors = this.bookRows.locator('td:nth-child(3)');
        this.bookPublishers = this.bookRows.locator('td:nth-child(4)');
        this.ascarrow = page.getByLabel('sorted-asc');
        this.descarrow = page.getByLabel('sorted-desc');
    }

    async addBooksToCollection(bookTitles) {
        for (let bookTitle of bookTitles) {
        await this.bookLink.filter({ hasText: bookTitle }).click();

        const dialogPromise = this.page.waitForEvent('dialog');
        await this.addToCollectionButton.click();
        await (await dialogPromise).accept();

        await this.backToBookStoreButton.click();
        
        }

        const profileResponse = this.page.waitForResponse(response =>
            response.url().includes('/Account/v1/User/') && response.status() === 200
        );

        await this.page.getByRole('link', { name: 'Profile' }).click();
        return (await profileResponse).json();
    }

    async deleteBookFromCollection(bookTitle) {
        const bookRow = this.bookRows.filter({ hasText: bookTitle });
        const deleteButton = bookRow.getByTitle('Delete');
        await deleteButton.click();

        const dialogPromise = this.page.waitForEvent('dialog');
        const deleteResponse = this.page.waitForResponse(response =>
            response.url().includes('/BookStore/v1/Book') && response.request().method() === 'DELETE'
        );
        await this.confirmOkButton.click();
        await (await dialogPromise).accept();
        await deleteResponse;
    }

    async cancelDeleteBookFromCollection(bookTitle) {
        const bookRow = this.bookRows.filter({ hasText: bookTitle });
        const deleteButton = bookRow.getByTitle('Delete');
        await deleteButton.click();

        await this.confirmCancelButton.click();
        await this.confirmCancelButton.waitFor({ state: 'hidden' });
    }

    async deleteAllBooksFromCollection() {
        const deleteResponse = this.page.waitForResponse(response =>
            response.url().includes('/BookStore/v1/Books') && response.request().method() === 'DELETE'
        );
     
        await this.deleteAllBooksButton.click();
        await this.confirmOkButton.click();
        await deleteResponse;
    };
        

    async cancelDeleteAllBooksFromCollection() {
        await this.deleteAllBooksButton.click();
        await this.confirmCancelButton.click();
        await this.confirmCancelButton.waitFor({ state: 'hidden' });
    }

    

}
