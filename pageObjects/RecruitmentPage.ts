import { Page, Locator } from '@playwright/test';

export class RecruitmentPage {
  readonly page: Page;
  readonly recruitmentMenu: Locator;
  readonly vacanciesTab: Locator;
  readonly candidatesTab: Locator;
  readonly addButton: Locator;
  readonly saveButton: Locator;
  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.recruitmentMenu = page.locator('span:has-text("Recruitment")');
    this.vacanciesTab = page.locator('a:has-text("Vacancies")');
    this.candidatesTab = page.locator('a:has-text("Candidates")');
    this.addButton = page.locator('button:has-text("Add")');
    this.saveButton = page.locator('button[type="submit"]');
    this.deleteButton = page.locator('button:has-text("Delete")');
    this.confirmDeleteButton = page.locator('button:has-text("Yes, Delete")');
  }

  async goto() {
    await this.recruitmentMenu.click();
    await this.page.waitForTimeout(2000);
  }

  async goToVacancies() {
    await this.vacanciesTab.click();
    await this.page.waitForTimeout(2000);
  }

  async goToCandidates() {
    await this.candidatesTab.click();
    await this.page.waitForTimeout(2000);
  }

  // Jobs-relative methods
  async addVacancy(vacancyData: {
    vacancyName: string;
    jobTitle: string;
    hiringManager: string;
    description?: string;
    numberOfPositions?: number;
    publishInRSS?: boolean;
  }) {
    await this.addButton.click();
    await this.page.waitForTimeout(2000);
    
    // 1. Vacancy Name - textbox role
    await this.page.getByRole('textbox').nth(1).fill(vacancyData.vacancyName); //It works but relies on the order of textboxes, which can change if the form layout changes.
    // await this.page.locator('.oxd-input-group:has-text("Vacancy Name") input').fill(vacancyData.vacancyName);  // It works but is too brittle易变的
    

    // 2. Job Title - combobox role (dropdown)
    await this.page.getByText('-- Select --').first().click();
    await this.page.getByRole('option', { name: vacancyData.jobTitle, exact: true }).click();
    // await this.page.locator('.oxd-select-text-input:has-text("-- Select --")').first().click(); 
   
    // 3. Hiring Manager - combobox role (autocomplete)
    await this.page.getByRole('textbox', { name: 'Type for hints...' }).fill(vacancyData.hiringManager);
    // await this.page.getByPlaceholder('Type for hints...').fill(vacancyData.hiringManager);

    await this.page.waitForTimeout(1000);
    await this.page.getByRole('option', { name: vacancyData.hiringManager, exact: true }).click();
    // await this.page.getByText(vacancyData.hiringManager, { exact: true }).click(); // It works but relies on the exact text match, which can be brittle if the UI changes or if there are multiple matches.
    
    // 4. Number of Positions -  textbox role
    await this.page.getByRole('textbox').nth(4).fill(vacancyData.numberOfPositions?.toString() || '');
   
    // 5. Description - textbox role (multiline)
    await this.page.getByPlaceholder('Type description here').fill(vacancyData.description || '');
    
    // 6. Active - checkbox role
    const activeToggle = this.page.locator('.oxd-switch-input').first();
    // const activeCheckbox = this.page.getByText('Active');// It does not work because the "Active" label is not directly associated with the checkbox input, making it difficult for Playwright to identify the correct element to interact with.
    // const activeCheckbox =this.page.locator('.orangehrm-switch-wrapper:has-text("Active") input[type="checkbox"]'); /dont work,
    // const activeCheckbox = this.page.locator('.orangehrm-switch-wrapper:has-text("Active") .oxd-switch-wrapper');
    // const activeCheckbox = this.page.locator('.oxd-switch-wrapper:has-text("Active")');it does not work because the "Active" label is not directly associated with 'oxd-switch-wrapper'
    if (await activeToggle.isChecked() === false) {
      await activeToggle.click();
    }
    
    // 7. Publish in RSS - checkbox role
    const rssToggle = this.page.locator('.oxd-switch-input').nth(1);
    // const rssCheckbox = this.page.getByText('Publish in RSS Feed and Web Page'); // It does not work because the "Publish in RSS Feed and Web Page" label is not directly associated with the checkbox input, making it difficult for Playwright to identify the correct element to interact with.
    // const rssCheckbox = this.page.locator('.orangehrm-switch-wrapper:has-text("Publish in RSS Feed and Web Page") .oxd-switch-wrapper');
    // const rssCheckbox = this.page.locator('.oxd-switch-wrapper:has-text("Publish in RSS Feed and Web Page")'); it does not work because the "Publish in RSS Feed and Web Page" label is not directly associated with 'oxd-switch-wrapper'
    if (vacancyData.publishInRSS) {
      await rssToggle.click();
    }
    
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  async searchVacancy(vacancyName: string): Promise<boolean> {
  
  // Make sure you're on the Vacancy tab page
    await this.goToVacancies();

    // Enter vacancy name in search field and click search
    await this.page.getByText('-- Select --').nth(1).click();
    await this.page.getByRole('option', { name: vacancyName, exact: true }).click();
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForTimeout(2000);
     // Check if vacancy exists in results table
    const vacancyExists = await this.page.getByRole('cell', { name: vacancyName }).isVisible({timeout: 10000});
    console.log(`Search for "${vacancyName}": ${vacancyExists ? 'FOUND' : 'NOT FOUND '}`);
    return vacancyExists;
  }

  async updateVacancy(oldvacancyName: string, newVacancyName: string, newJobTitle: string) {
    await this.searchVacancy(oldvacancyName);
    const editButton = this.page.getByRole('button').filter({ has: this.page.locator('.bi-pencil-fill') });
    await editButton.click();
    await this.page.waitForTimeout(3000);

    // Update vacancy name 
    // await this.page.getByRole('textbox').nth(1).fill(newVacancyName);
    console.log('The number of textbox:', await this.page.locator('input.oxd-input.oxd-input--active').count() ) //output is 2
    await this.page.locator('div.oxd-input-group').filter( {hasText: 'Vacancy Name'}).locator('input').fill(newVacancyName);


    //Fill Job title
    await this.page.locator('.oxd-select-text.oxd-select-text--active').click();
    await this.page.getByRole('option', { name: newJobTitle, exact: true }).click();
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForTimeout(5000);
  }

  async deleteVacancy(vacancyName: string) {
    await this.searchVacancy(vacancyName);
    const deleteButton = this.page.getByRole('button').filter({ has: this.page.locator('.bi-trash') });
    await deleteButton.click();
    await this.page.getByText('Are you Sure?').waitFor({ timeout: 5000 });
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    await this.page.waitForTimeout(2000);
  }
}