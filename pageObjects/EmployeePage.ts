import { Page, Locator } from '@playwright/test';

export class EmployeePage {
  readonly page: Page;
  readonly pimMenu: Locator;
  readonly addEmployeeButton: Locator;
  readonly employeeListTab: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly createLoginCheckbox: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly jobTab: Locator;
  readonly jobTitleSelect: Locator;
  readonly employmentStatusSelect: Locator;
  readonly joinedDateInput: Locator;
  readonly jobCategorySelect: Locator;
  readonly subUnitSelect: Locator;
  readonly locationSelect: Locator;
  readonly saveJobDetailsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pimMenu = page.locator('span:has-text("PIM")');
    this.addEmployeeButton = page.locator('button:has-text("Add")');
    this.employeeListTab = page.locator('a:has-text("Employee List")');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.getByRole('textbox').nth(4); 
    this.createLoginCheckbox = page.locator('div:has-text("Create Login Details") input[type="checkbox"]');
    // this.usernameInput = page.locator('input:below(div:has-text("Username"))').first();
    this.usernameInput = page.getByRole('textbox').nth(5); 
    this.passwordInput = page.locator('input[type="password"]').first();
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    // this.saveButton = page.locator('button[type="submit"]:has-text("Save")');
    this.saveButton = page.getByRole('button', { name: 'Save' }).first();
    this.cancelButton = page.getByRole('button', { name: 'Cancel' }).first();
    
    // Job details selectors (after employee is created)
    this.jobTab = page.locator('a:has-text("Job")');
    this.jobTitleSelect = page.getByText('-- Select --').first();
    this.joinedDateInput = page.getByPlaceholder('yyyy-dd-mm');
    this.jobCategorySelect = page.locator('div:nth-child(4) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text');
    this.subUnitSelect = page.locator('div:nth-child(5) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text');
    this.locationSelect = page.locator('div:nth-child(6) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text');
    this.employmentStatusSelect = page.locator('div:nth-child(7) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text');
    this.saveJobDetailsButton = page.getByRole('button', { name: 'Save' });
    // this.saveJobDetailsButton = page.locator('button[type="submit"]'); 
  }

  async gotoPIM() {
        await this.pimMenu.click();
        await this.page.waitForURL('**/pim/viewEmployeeList');
  }

  async addBasicEmployeeInfo(
        firstName: string,
        lastName: string,
        middleName?: string,
        employeeId?: string,
        userName?: string,
        passWord?: string
    ) {
        await this.addEmployeeButton.click();
        await this.page.waitForURL('**/pim/addEmployee');

        await this.firstNameInput.fill(firstName);

        if (middleName) {
        await this.middleNameInput.fill(middleName);
        }

        await this.lastNameInput.fill(lastName);
        
        if (employeeId) {
        await this.employeeIdInput.clear();
        await this.employeeIdInput.fill(employeeId);
        }
    
        // Create Login Details
        if (!await this.createLoginCheckbox.isChecked()) {
            await this.page.locator('span.oxd-switch-input').click();     
        }
        
        await this.usernameInput.fill(userName || '');
        await this.passwordInput.fill(passWord || '');
        await this.confirmPasswordInput.fill(passWord || '');
    
        // Save employee basic details
        await this.saveButton.click();
        await this.page.waitForTimeout(2000); 
        await this.page.waitForURL('**/pim/viewPersonalDetails/**', { timeout: 10000 });
    
    }

  async navigateToJobTab() {
    await this.jobTab.click();
    await this.page.waitForTimeout(1000);
  }

  async setJoinedDate(date: string) {
    await this.joinedDateInput.fill(date);
  }

  async setJobTitle(jobTitle: string) {
    await this.jobTitleSelect.click();
    await this.page.getByRole('option', { name: jobTitle, exact: true }).click();
    // await this.page.locator(`div[role="listbox"] span:has-text("${jobTitle}")`).click();
  }

  async setJobCategory(jobCategory: string) {
    await this.jobCategorySelect.click();
    await this.page.getByRole('option', { name: jobCategory, exact: true }).click();
  }

  async setSubUnit(subUnit: string) {
    await this.subUnitSelect.click();
    await this.page.getByRole('option', { name: subUnit, exact: true }).click();
  }

  async setLocation(location: string) {
    await this.locationSelect.click();
    await this.page.getByRole('option', { name: location, exact: true }).click();
  }
  async setEmploymentStatus(employmentStatus: string) {
    await this.employmentStatusSelect.click();
    await this.page.getByRole('option', { name: employmentStatus, exact: true }).click();
  }

  async saveEmployeeJobdetails() {
    await this.saveJobDetailsButton.click();
    await this.page.waitForTimeout(2000); 
  }
  
  async navigatetoEmployeeList() {
    
  }

  async searchEmployee(expectedId: string, firstName: string, fullName: string): Promise<boolean> {
        // Navigate to Employee List
        await this.employeeListTab.click();
        await this.page.waitForURL('**/pim/viewEmployeeList');

        // Search for the employee by name that was just created
        const employeeName = this.page.getByPlaceholder('Type for hints...').first();
        await employeeName.fill(fullName);
        await this.page.waitForTimeout(2000);
        // await this.page.locator('.oxd-autocomplete-dropdown').getByText(fullName, { exact: true }).click();
        

        // Click the search button
        await this.page.getByRole('button', { name: 'Search' }).click();
        await this.page.waitForTimeout(2000);

        // Go to the results table and check if the employee is listed
        const employee = this.page.getByRole('cell', { name: expectedId, exact: true });
        return await employee.isVisible();    
        console.log(`Employee "${fullName}" found in the employee list.`);
    }

}