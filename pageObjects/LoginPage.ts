import { Page, Locator } from '@playwright/test';
import { testConfig } from '../testConfig';


export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly dashboardHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.dashboardHeader = page.getByRole('heading', { name: 'Dashboard' });
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
  }

//   async login(username: string, password: string) {
//     await this.usernameInput.fill(username);
//     await this.passwordInput.fill(password);
//     await this.loginButton.click();
//     await this.dashboardHeader.waitFor({ state: 'visible' });
//   }

  async login(): Promise<void> {
    const password = testConfig.password;
    await this.usernameInput.fill(testConfig.username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.dashboardHeader.waitFor({ state: 'visible' });
}
}