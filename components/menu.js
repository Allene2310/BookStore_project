export class Menu {
    constructor(page) {
        this.page = page;
        this.bookStoreApplicationMenu = this.page
        .locator('.element-group')
        .filter({ hasText: 'Book Store Application' });
        this.menuDropdownButton = this.bookStoreApplicationMenu.locator('.header-right');
        this.menuHeader = this.page.getByText('Book Store Application');
        this.loginMenuItemLink = this.page.getByRole('link', { name: 'Login', exact: true });
        this.bookStoreMenuItemLink = this.page.getByRole('link', { name: 'Book Store', exact: true });
        this.profileMenuItemLink = this.page.getByRole('link', { name: 'Profile', exact: true });
        this.bookStoreAPIMenuItemLink = this.page.getByRole('link', { name: 'Book Store API', exact: true });
        this.menuList = this.bookStoreApplicationMenu.locator('.menu-list');
        this.menuItems = this.menuList.locator('li');
        this.navigationMenuButton = this.page.locator('.navbar button');
        

    }
}
