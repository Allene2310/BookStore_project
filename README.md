# Book Store Application 

## Project Overview

This project demonstrates end-to-end QA testing of the Book Store Application.

The project includes:
- requirements analysis
- test scenarios
- test cases
- bug reports
- test execution summary
- API/UI automation tests using Playwright

## Application Under Test

DemoQA Book Store Application: https://demoqa.com/books

## Tested Functionality

- Registration
- Login
- Profile page
- Book Store page
- Book Details page
- Book Store Application menu
- Logout
- Delete Account

## Testing Types

- Functional testing
- UI testing
- Responsive testing
- Basic Accessibility testing
- API testing
- Exploratory testing

## Tools Used

- Jira
- Google Sheets
- Playwright
- JavaScript
- Git / GitHub
- Chrome DevTools
- Chrome / MS Edge

## Project Structure

```text
BookStore_project/
├── .github/workflows/        # GitHub Actions workflow
├── components/               # Reusable components used in automation tests
├── pages/                    # Page Object Model classes
├── tests/                    # Playwright UI and API automated tests
├── docs/                     # QA documentation
│   ├── requirements/
│   ├── test-scenarios/
│   ├── test-cases/
│   ├── bug-reports/
│   └── test-reports/
├── evidence/                 # Screenshots, reports, and test evidence
│   ├── screenshots/
│   └── html-reports/
├── package.json
├── package-lock.json
├── playwright.config.js
└── README.md
```

## Key Findings

Testing identified issues related to:

- reCAPTCHA behavior during registration
- validation of spaces in registration fields
- username trimming
- password case sensitivity during login
- Delete All Books functionality
- Delete Account functionality
- external website links
- mobile menu behavior
- navigation from the API documentation page

## Automation Scope

Automation tests are implemented using Playwright.

Current automation coverage includes:

- Registration API checks
- Registration UI checks
- Login functionality
- Profile page functionality
- Book Store page functionality
- Book Details page functionality
- Book Store Application Menu functionality
- Delete Account API checks
- Delete Account UI checks





