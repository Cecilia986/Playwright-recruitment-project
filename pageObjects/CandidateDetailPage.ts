import { Page, Locator, expect } from '@playwright/test';

export class CandidateDetailPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly saveButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly vacancyInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly notesInput: Locator;
  readonly dateInput: Locator;
  readonly keywordsInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('button:has-text("Add")');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.vacancyInput = page.getByText('-- Select --');
    this.emailInput = page.getByRole('textbox', { name: 'Type here' }).first();
    this.phoneInput = page.getByRole('textbox', { name: 'Type here' }).nth(1);
    this.keywordsInput = page.getByRole('textbox', {name: 'Enter comma seperated words'});
    this.dateInput = page.getByRole('textbox', { name: 'yyyy-dd-mm' });
    this.notesInput = page.getByPlaceholder('Type here').nth(2);
  }

  async addCandidate(candidateData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    vacancy: string;
    notes?: string;
    date?: string;
    keywords?: string[];
    resumePath?: string;
  }) {
    await this.addButton.click();
    await this.firstNameInput.fill(candidateData.firstName);
    await this.lastNameInput.fill(candidateData.lastName);
    await this.vacancyInput.click();
    await this.page.getByRole('option', { name: candidateData.vacancy }).click();
    await this.emailInput.fill(candidateData.email);
    await this.phoneInput.fill(candidateData.phone);
    await this.keywordsInput.fill(candidateData.keywords?.join(', ') || '');
    await this.dateInput.fill(candidateData.date || '');
    await this.notesInput.fill(candidateData.notes || '');
    
    if (candidateData.resumePath) {
      const fileInput = this.page.locator('input[type="file"]');
      await fileInput.setInputFiles(candidateData.resumePath);
      // await this.page.getByText('Browse').setInputFiles(candidateData.resumePath);

      // If there's a button with role="button"
      // await this.page.getByRole('button', { name: 'Browse' }).click();
      // // Then handle file input
      // await this.page.locator('input[type="file"]').setInputFiles(candidateData.resumePath);
    }

    await this.page.locator('.oxd-icon.bi-check').click();
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  async searchCandidate(firstName: string, lastname:string, vacancyName: string): Promise<boolean> {

    //Go to the candidate search page 
    await this.page.goto('/web/index.php/recruitment/viewCandidates'); 

    //Type the first name in the candidate Name    
    await this.page.fill('input[placeholder="Type for hints..."]', firstName);
    await this.page.waitForSelector('.oxd-autocomplete-dropdown', { state: 'visible' });
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('option', { name: `${firstName} ${lastname}` }).first().click();

    // Type vacancy name in the vacancy dropdown
    const dropdowns = this.page.locator('.oxd-select-text');
    const dropdownCount = await dropdowns.count();
    console.log(`Found ${dropdownCount} dropdowns`);

    await dropdowns.nth(1).click();
    await this.page.getByRole('option', { name: vacancyName }).click();

    // Click  search button
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(2000);

    //Go to the beblow table results and check if the candidate exists
    const rows = this.page.getByRole('row');
    const rowCount = await rows.count();
    console.log(` ${rowCount} rows in the candidate table`);
    
    //Verify if the candidate exists in the table
    for (let i = 0; i < rowCount; i++) {
        const rowText = await rows.nth(i).textContent();
        if (rowText?.includes(firstName) && rowText?.includes(vacancyName)) {
            console.log(`Candidate ${firstName} found with vacancy ${vacancyName}`);
            return true;
        }
    }
    
    console.log(`Candidate ${firstName} not found`);
    return false;
  }

  // async updateCandidate(oldName: string, 
  //   oldLastName: string,
  //   newFirstName: string, 
  //   newLastName: string,
  //   vacancyName: string) {
  //   await this.searchCandidate(oldName, oldLastName, vacancyName)
  //   // await this.page.click('button:has-text("Edit")');
  //   await this.page.fill('input[name="firstName"]', newFirstName);
  //   await this.page.fill('input[name="lastName"]', newLastName);
  //   await this.saveButton.click();
  //   await this.page.waitForTimeout(2000);
  // }

  // async deleteCandidate(name: string) {
  //   // await this.searchCandidate(name);
  //   await this.page.click('button:has-text("Delete")');
  //   await this.page.locator('button:has-text("Yes, Delete")').click();
  //   await this.page.waitForTimeout(2000);
  // }

  // async verifyCandidateStatus(candidateName: string, expectedStatus: string) {
  //   // await this.searchCandidate(candidateName);
  //   const status = await this.page.locator('.oxd-table-cell:has-text("' + expectedStatus + '")').textContent();
  //   expect(status?.trim()).toContain(expectedStatus);
  // }

  async shortlistCandidate(firstName: string, 
      lastName: string,
      vacancyName: string) {
        //Search the candidate and open the Shortlist page  
      await this.searchCandidate(firstName, lastName, vacancyName)
      await this.page.locator('.oxd-icon.bi-eye-fill').click();
      await this.page.waitForTimeout(2000);

      //Click the Shortlist button and fill the details
      await this.page.getByRole('button', {name: ' Shortlist '}).click();
      // await this.page.locator('.oxd-button--success').click();
      // await this.page.click('button:has-text("Shortlist")');
      
      await this.page.waitForTimeout(2000);
      await this.page.getByPlaceholder('Type here').fill('Shortlisted for interview');

      await this.page.getByRole('button', {name: 'Save'}).click();
      
      // Verigy success message
      // const successToast = this.page.locator('.oxd-toast--success'); 
      const successMessage = this.page.getByText('Successfully Updated');
      await successMessage.waitFor({ state: 'visible', timeout: 10000 });
      console.log('Success message verified and captured');

      // Verify candidate status is updated to "Shortlisted"
      const status = this.page.getByText('Status: Shortlisted');
      await expect(status).toBeVisible();

      // Alternative way to verify status
      const statusElement = this.page.locator('.orangehrm-recruitment-status');
      await expect(statusElement).toContainText('Shortlisted');
      console.log('Candidate status updated to Shortlisted');

  }

  async scheduleInterview(firstName: string, lastName: string, 
    vacancyName:string, 
    interviewDate: string, 
    interviewer: string) {
    //Search the candidate and open the Schedule Interview page
    // await this.searchCandidate(firstName, lastName, vacancyName)
    // await this.page.locator('.oxd-icon.bi-eye-fill').click();
    // await this.page.waitForTimeout(2000);

    //Click the Schedule Interview button and fill the interview details
    await this.page.getByRole('button', {name: 'Schedule Interview'}).click(); 

    //Fill the interviewtitle
    const interviewTitle = this.page.getByRole('textbox').nth(5);
    await interviewTitle.fill('interview title');

    //Fill the interviewer
    await this.page.locator('.oxd-autocomplete-text-input input').fill(interviewer);
    // await this.page.getByPlaceholder('Type here for hints...').fill(interviewer);
    await this.page.waitForSelector('.oxd-autocomplete-dropdown', { state: 'visible' });
    await this.page.getByRole('option', { name: interviewer }).click();

    //Fill the interview date and Time
    await this.page.getByPlaceholder('yyyy-dd-mm').fill(interviewDate);

    await this.page.getByRole('textbox', { name: 'hh:mm' }).click();
    // await this.page.locator('.oxd-time-input').click();
    // Fill hour (e.g., "10")
    // await this.page.getByPlaceholder("hh:mm").fill("11:00");
    await this.page.locator('.oxd-input.oxd-input--active.oxd-time-hour-input-text').fill('10');
    // Fill minute (e.g., "00")
    await this.page.locator('.oxd-input.oxd-input--active.oxd-time-minute-input-text').fill('30'); 
    // Select AM/PM
    await this.page.locator('input[name = "am"][value = "AM"]').click();
    

    // Save the interview schedule
    await this.page.click('button:has-text("Save")');

    // Verify success message
    const successMessage = this.page.getByText('Successfully Updated');
    await successMessage.waitFor({ state: 'visible', timeout: 10000 });

    const status = this.page.getByText('Status: Interview Scheduled');
    await expect(status).toBeVisible();
    console.log('Interview scheduled successfully');
  }

  async verifyCandidateStatus(candidateName: string, expectedStatus: string) {
    // await this.searchCandidate(candidateName);
    const candidate = this.page.getByText(candidateName).first();
    await expect(candidate).toBeVisible();

    const status = this.page.getByText(expectedStatus);
    await expect(status).toBeVisible();
    console.log(`Candidate status verified as ${expectedStatus}`);
  }

  async markInterviewPassed(candidateName: string) {
    // const candidate = this.page.getByText(candidateName);
    // await expect(candidate).toBeVisible();
    
    // await this.page.click('button:has-text("Mark Interview Passed")');
    await this.page.getByRole('button', {name: 'Mark Interview Passed'}).click();
    await this.page.click('button:has-text("Save")');
    await this.page.waitForTimeout(2000);
  }

  async offerJob(candidateName: string) {
    // await this.searchCandidate(candidateName);
    await this.page.click('button:has-text("Offer Job")');
    await this.page.click('button:has-text("Save")');
    await this.page.waitForTimeout(2000);
  }

  async hireCandidate(candidateName: string) {
    // await this.searchCandidate(candidateName);
    await this.page.click('button:has-text("Hire")');
    await this.page.click('button:has-text("Save")');
    await this.page.waitForTimeout(2000);
  }
}