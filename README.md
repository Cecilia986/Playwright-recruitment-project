#  Project Overview

This project implements a **production-style automation framework** that supports testing of Recruitment system.
The framework supports containerized execution using Docker and automated CI/CD pipelines using GitHub Actions.
The framework is designed using **Page Object Model (POM)** and modular architecture to ensure maintainability, scalability, and reusability.

Key objectives of this project:

- Build a scalable and maintainable automation framework
- Demonstrate UI automation capabilities
- Apply modern automation design patterns
- Support CI/CD-based test execution
- Simulate real-world enterprise automation workflows

#  Framework Architecture

The framework follows a modular layered design:

tests/ 

    ├── functional/ # UI test scenarios 
    ├── api/ # API test scenarios 

pages/  # Page Object Model classes

testdata/  # Store test data

config/    # Environment configuration

reports/   # Test output reports


### Architecture Layers

**Tests Layer**
- Contains UI and API test cases
- Implements business-level workflows

**Page Layer**
- Implements Page Object Model (POM)
- Encapsulates UI element interactions

**Utilities Layer**
- Provides reusable helper functions
- Includes API helpers and test utilities

**Configuration Layer**
- Manages test environments
- Controls browser and execution settings

**Reporting Layer**
- Generates execution reports
- Supports HTML and Allure reports

#  Test Coverage

This framework includes testing for both **UI workflows**.

##  UI Testing (`tests/functional/`)

### Covered Scenarios:
-Login
-Add Employee
-Add Candidates
-Complete candidate workflow - Shortlist → Interview → Offer → Hired
-Add new vacancy and update

#  Tech Stack

| Category | Tools |
|----------|------|
| Language | TypeScript |
| Test Framework | Playwright |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| Reporting | Allure, Ortoni |
| Version Control | Git |
| Package Manager | npm |

#  Prerequisites

Before running this project, install:

- **Node.js** (v18 or later)
- **npm**

Verify installation:
node -v
npm -v

#  Installation & Setup

Clone the repository:
git clone https://github.com/Cecilia986/Playwright-recruitment-project.git

cd Playwright-recruitment-project

Install dependencies:
npm install

Install Playwright browsers:
npx playwright install

#  Running Tests

Run all tests:
npx playwright test

Run UI tests only:
npx playwright test tests/functional/

Run API tests only:
npx playwright test tests/api/

Run tests in headed mode:
npx playwright test --headed

Run tests in debug mode:
npx playwright test --debug

# Test Reports

After test execution:

Playwright generates:

- HTML Reports
- Allure Reports
- Ortoni Reports

To open HTML report:
npx playwright show-report

#  Cross-Browser Testing

The framework supports:

- Chromium
- Chrome
- Firefox
- WebKit

Configured in:
playwright.config.ts

#  Docker Support

This project supports containerized test execution using Docker, ensuring consistent test environments across machines.

## Build Docker Image

docker build -t playwright-tests .

## Run Tests Inside Docker

docker run --rm playwright-tests

Run Specific Tests: 

docker run --rm playwright-tests npx playwright test tests/api/

## Benefits of Using Docker

- Ensures consistent test environment
- Eliminates local dependency issues
- Improves portability
- Supports CI/CD execution

#  CI/CD Integration

This project integrates with **GitHub Actions** to automatically execute tests whenever code changes are pushed to the repository.

## CI/CD Workflow

1. Developer updates test code locally
2. Tests are verified locally using Docker
3. Code is pushed to GitHub
4. GitHub Actions pipeline is triggered
5. Dependencies are installed
6. Playwright browsers are installed
7. UI and API tests are executed
8. Reports are generated automatically

## Benefits

- Continuous regression testing
- Automated quality checks
- Early defect detection
- Improved release confidence

#  Automation Workflow

Local Development -> Run Tests in Docker -> Git Push -> GitHub Actions Triggered -> Install Dependencies
-> Execute Tests -> Generate Reports



