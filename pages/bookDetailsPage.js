export class BookDetailsPage {
    constructor(page) {
        this.page = page;
        this.loginNavigationButton = page.getByRole('button', {name: 'Login'});
        this.logoutButton = page.getByRole('button', {name: 'Log out'});
        this.userNameDisplay = page.locator('#login-wrapper #userName-value');
        this.addToCollectionButton = page.getByRole('button', { name: 'Add To Your Collection' });
        this.backToBookStoreButton = page.getByRole('button', { name: 'Back To Book Store' });
        this.bookISBN = page.locator('#ISBN-wrapper .col-md-9');
        this.bookTitle = page.locator('#title-wrapper .col-md-9');
        this.bookSubTitle = page.locator('#subtitle-wrapper .col-md-9');
        this.bookAuthor = page.locator('#author-wrapper .col-md-9');
        this.bookPublisher = page.locator('#publisher-wrapper .col-md-9');
        this.bookPages = page.locator('#pages-wrapper .col-md-9');
        this.bookDescription = page.locator('#description-wrapper .col-md-9');
        this.bookWebsite = page.locator('#website-wrapper .col-md-9 label');
        
    }

    async addBookToCollection() {
        const dialogPromise = this.page.waitForEvent('dialog');
        await this.addToCollectionButton.click();
        const dialog = await dialogPromise;
        const message = dialog.message();
        await dialog.accept();
        return message;
    }

    async duplicateBookInCollection() {
        const dialogPromise = this.page.waitForEvent('dialog');
        await this.addToCollectionButton.click();
        const dialog = await dialogPromise;
        const message = dialog.message();
        await dialog.accept();
        return message;
    }

    
}

   
        


