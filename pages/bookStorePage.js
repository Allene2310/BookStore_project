export class BookStorePage {
    constructor(page) {
        this.page = page;
        this.loginNavigationButton = page.getByRole('button', {name: 'Login'});
        this.logoutButton = page.getByRole('button', { name: 'Log out' });
        this.userNameDisplay = page.locator('#userName-value');
        this.searchInput = page.getByRole('textbox', { name: 'Type to search' });
        this.bookTable = page.getByRole('table');
        this.bookRows = this.bookTable.locator('tbody tr');
        this.titleLink =page.locator('.action-buttons a');
        this.bookImages = this.bookRows.locator('td:nth-child(1) img');
        this.bookTitles = this.bookRows.locator('td:nth-child(2)');
        this.bookAuthors = this.bookRows.locator('td:nth-child(3)');
        this.bookPublishers = this.bookRows.locator('td:nth-child(4)');
        this.sortTitleButton = page.getByRole('columnheader', { name: 'Title' });
        this.sortAuthorButton = page.getByRole('columnheader', { name: 'Author' });
        this.sortPublisherButton = page.getByRole('columnheader', { name: 'Publisher' });
        this.previousPageButton = page.getByRole('button', { name: 'Previous' });
        this.nextPageButton = page.getByRole('button', { name: 'Next' });
        this.ascArrow = page.getByLabel('sorted-asc');
        this.descArrow = page.getByLabel('sorted-desc');
    }

    async navigateToBookStore() {
        await this.page.goto('https://demoqa.com/books');
    };


};
