import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pageObjects/LoginPage';
import { EmployeePage } from '../../pageObjects/EmployeePage';
import employeeData from '../../testdata/employeeData.json';  // Import JSON data

test.describe('Add Employee', () => {
  let loginPage: LoginPage;
  let employeePage: EmployeePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    employeePage = new EmployeePage(page);
    
    // Login to OrangeHRM
    await loginPage.goto();
    await loginPage.login(); // Update with your credentials
  });

  test('Add employee with job details', async() =>{
    // Employee data matching your requirement
        const empData = employeeData.employee[2];
        const employeeId = Math.floor(1000 + Math.random() * 9000);
        const userName = `Alibaba.${employeeId}`;
        // const firstName = `Ali${employeeId}`;
        const firstName = empData.firstName;
        const fullName = `${firstName} ${empData.middleName || ''} ${empData.lastName}`;

        // Navigate to PIM and Add Employee
        await employeePage.gotoPIM();

        // Add employee basic details
        await employeePage.addBasicEmployeeInfo(
            firstName,
            empData.lastName,
            empData.middleName,
            employeeId.toString(),
            userName,
            empData.passWord
        );
        // Navigate to Job tab and fill job details
        await employeePage.navigateToJobTab();
        await employeePage.setJoinedDate(empData.joinedDate);
        await employeePage.setJobTitle(empData.jobTitle);
        await employeePage.setJobCategory(empData.jobCategory);
        await employeePage.setSubUnit(empData.subUnit);
        await employeePage.setLocation(empData.location);
        // await employeePage.setEmploymentStatus(empData.employmentStatus);
        await employeePage.saveEmployeeJobdetails();

        await employeePage.navigatetoEmployeeList();

        // Verify employee was added successfully
        const isVisible = await employeePage.searchEmployee( employeeId.toString(), firstName, fullName);
        expect(isVisible).toBeTruthy();

    });
});