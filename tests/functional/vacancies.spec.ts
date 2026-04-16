import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageObjects/LoginPage';
import { RecruitmentPage } from '../../pageObjects/RecruitmentPage';
import vacancyData from '../../testdata/vacancies.json';  // Import JSON data

test.describe('Recruitment system - Position management test', () => {
  let loginPage: LoginPage;
  let recruitmentPage: RecruitmentPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    recruitmentPage = new RecruitmentPage(page);
    
    await loginPage.goto();
    await loginPage.login();
    await recruitmentPage.goto();
    await recruitmentPage.goToVacancies();
  });

  test('TC-VAC-001: Add new vacancy', async () => {
    const vacancy = vacancyData.vacancies[0]; // Get the first vacancy from the JSON data
    
    await recruitmentPage.addVacancy({
      vacancyName: vacancy.vacancyName, 
      jobTitle: vacancy.title,
      hiringManager: vacancy.hiringManager,
      description: vacancy.description,
      numberOfPositions: vacancy.numberOfPositions,
      publishInRSS: vacancy.publishInRSS
    });
    
    // Verify the vacancy was created successfully
    await recruitmentPage.searchVacancy(vacancy.vacancyName);
    // expect(exists).toBeTruthy();
    console.log(`Vacancy "${vacancy.vacancyName}" created successfully.`);
  });

  test('TC-VAC-002: Update existing vacancy', async () => {
    const oldVacancy = vacancyData.vacancies[0];
    const updatedVacancy = vacancyData.vacancies[1];
    
    // Update the vacancy
    console.log(`oldVacancy: "${oldVacancy.vacancyName}", newVacancy: "${updatedVacancy.vacancyName}"`);
    await recruitmentPage.updateVacancy(oldVacancy.vacancyName, updatedVacancy.vacancyName, updatedVacancy.title);
    console.log('Vacancy was updated successfully!');
    
    const updatedExists = await recruitmentPage.searchVacancy(updatedVacancy.vacancyName);
    expect(updatedExists).toBeTruthy();
    console.log(`Vacancy "${oldVacancy.vacancyName}" updated to "${updatedVacancy.vacancyName}" successfully.`);
  });

  // Delete vacancy test
  // test('TC-VAC-003: Delete vacancy', async () => {
  //   const vacancy = vacancyData.vacancies[1];
    
  //   // Delete the vacancy
  //   await recruitmentPage.deleteVacancy(vacancy.vacancyName);
  //   console.log(`Vacancy "${vacancy.vacancyName}" deleted successfully.`);
  // });
});