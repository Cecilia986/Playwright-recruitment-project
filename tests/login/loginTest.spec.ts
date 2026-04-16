import { test } from '@playwright/test';
import { LoginPage } from '../../pageObjects/LoginPage';

test('Login test', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login();
    
    console.log(' Login successful!');
});