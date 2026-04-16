import dotenv from 'dotenv';
dotenv.config();

export const testConfig = {
    qa: `https://opensource-demo.orangehrmlive.com`,
    dev: `https://opensource-demo.orangehrmlive.com`,
    qaApi: ``,
    devApi: ``,
    username: process.env.TEST_USERNAME || `Admin`,
    password: process.env.TEST_PASSWORD || `admin123`,
    isPasswordEncrypted: false,
    waitForElement: 120000,
    dbUsername: ``,
    dbPassword: ``,
    dbServerName: ``,
    dbPort: ``,
    dbName: ``
}