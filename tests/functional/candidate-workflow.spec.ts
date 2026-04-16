import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageObjects/LoginPage';
import { RecruitmentPage } from '../../pageObjects/RecruitmentPage';
import { CandidateDetailPage } from '../../pageObjects/CandidateDetailPage';
import candidateData from '../../testdata/candidates.json';
import path from 'path';

test.describe('Recruitment System - Candidate Workflow Tests', () => {
  let loginPage: LoginPage;
  let recruitmentPage: RecruitmentPage;
  let candidateDetailPage: CandidateDetailPage;

  const uniqueId = Date.now();
  const testCandidates = candidateData.candidates[0];
  const phone = `138${uniqueId.toString().slice(-8)}`;
  const fullName = `${testCandidates.firstName} ${testCandidates.lastName}`;

  // Get absolute path to resume
  const resumePath = path.resolve(process.cwd(), testCandidates.resume);
  
  // const workflowId = Date.now();
  // const workflowCandidate = {
  //   firstName: `workflow${workflowId}`,
  //   lastName: 'test',
  //   fullName: `workflow${workflowId} candidate`,
  //   email: `workflow.${workflowId}@example.com`,
  //   phone: `136${workflowId.toString().slice(-8)}`,
  //   vacancy: 'Senior QA Lead'
  // };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    recruitmentPage = new RecruitmentPage(page);
    candidateDetailPage = new CandidateDetailPage(page);
    
    await loginPage.goto();
    await loginPage.login();
    await recruitmentPage.goto();
    await recruitmentPage.goToCandidates();

    // Create a candidate for workflow tests
    await candidateDetailPage.addCandidate({
      firstName: testCandidates.firstName,
      lastName: testCandidates.lastName,
      email: testCandidates.email,
      phone: phone,
      vacancy: testCandidates.vacancy,
      notes: testCandidates.notes,
      date: testCandidates.dateOfApplication,
      keywords: testCandidates.keywords,
      resumePath: resumePath
    });
    
  });

  test('TC-WF-001: The complete candidate workflow - Shortlist → Interview → Offer → Hired', async () => {
    // Step 1: Shortlist
    await candidateDetailPage.shortlistCandidate(testCandidates.firstName, testCandidates.lastName, testCandidates.vacancy);
    await candidateDetailPage.verifyCandidateStatus(fullName, 'Status: Shortlisted');
    
    // Step 2: Schedule Interview
    const interviewDate = '2026-04-15';
    const interviewer = 'Alibaba test'
    await candidateDetailPage.scheduleInterview(testCandidates.firstName, testCandidates.lastName, testCandidates.vacancy, interviewDate, interviewer);
    await candidateDetailPage.verifyCandidateStatus(fullName, 'Status: Interview Scheduled');
    
    // Step 3: Interview Passed
    await candidateDetailPage.markInterviewPassed(fullName);
    await candidateDetailPage.verifyCandidateStatus(fullName, 'Status: Interview Passed');
    
    // Step 4: Send Offer
    await candidateDetailPage.offerJob(fullName);
    await candidateDetailPage.verifyCandidateStatus(fullName, 'Status: Job Offered');
    
    // Step 5: Hire
    await candidateDetailPage.hireCandidate(fullName);
    await candidateDetailPage.verifyCandidateStatus(fullName, 'Status: Hired');
  });

  // test('TC-WF-002: Candidate rejected during shortlisting', async () => {
  //   const rejectId = Date.now();
  //   const rejectCandidate = {
  //     firstName: `Rejected${rejectId}`,
  //     lastName: 'Test',
  //     fullName: `Rejected${rejectId} Test`,
  //     email: `reject.${rejectId}@example.com`,
  //     phone: `135${rejectId.toString().slice(-8)}`,
  //     vacancy: 'Senior QA Lead'
  //   };
    
  //   // Create candidate
  //   await candidateDetailPage.addCandidate({
  //     firstName: rejectCandidate.firstName,
  //     lastName: rejectCandidate.lastName,
  //     email: rejectCandidate.email,
  //     phone: rejectCandidate.phone,
  //     vacancy: rejectCandidate.vacancy
  //   });
    
  //   // Reject candidate during shortlisting
  //   await candidateDetailPage.shortlistCandidate(rejectCandidate.fullName);
  //   await candidateDetailPage.page.click('button:has-text("Reject")');
  //   await candidateDetailPage.page.click('button:has-text("Save")');
  //   await candidateDetailPage.page.waitForTimeout(2000);
    
  //   await candidateDetailPage.verifyCandidateStatus(rejectCandidate.fullName, 'Rejected');
  // });

  // test('TC-WF-003: Verify candidate status is irreversible (cannot go back to interview stage after being hired)', async () => {
  //   const irreversibleId = Date.now();
  //   const irreversibleCandidate = {
  //     firstName: `Irreversible${irreversibleId}`,
  //     lastName: 'Test',
  //     fullName: `Irreversible${irreversibleId} Test`,
  //     email: `irreversible.${irreversibleId}@example.com`,
  //     phone: `134${irreversibleId.toString().slice(-8)}`,
  //     vacancy: 'Senior QA Lead'
  //   };
    
  //   // Create and complete the full workflow
  //   await candidateDetailPage.addCandidate({
  //     firstName: irreversibleCandidate.firstName,
  //     lastName: irreversibleCandidate.lastName,
  //     email: irreversibleCandidate.email,
  //     phone: irreversibleCandidate.phone,
  //     vacancy: irreversibleCandidate.vacancy
  //   });
    
  //   await candidateDetailPage.shortlistCandidate(irreversibleCandidate.fullName);
  //   await candidateDetailPage.scheduleInterview(irreversibleCandidate.fullName, '2026-04-16', 'Odis Aderman');
  //   await candidateDetailPage.markInterviewPassed(irreversibleCandidate.fullName);
  //   await candidateDetailPage.offerJob(irreversibleCandidate.fullName);
  //   await candidateDetailPage.hireCandidate(irreversibleCandidate.fullName);
    
  //   // verify candidate is marked as Hired
  //   await candidateDetailPage.verifyCandidateStatus(irreversibleCandidate.fullName, 'Hired');
    
  //   // verify that the candidate cannot be moved back to the interview stage (the Action button should not be visible or available)
  //   const actionButtonExists = await candidateDetailPage.page.locator('button:has-text("Schedule Interview")').isVisible();
  //   expect(actionButtonExists).toBeFalsy();
  // });
});