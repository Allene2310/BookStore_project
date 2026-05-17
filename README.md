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
- Accessibility testing
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
├── pages/                 # Page Object Model classes
├── tests/                 # Playwright automation tests
├── docs/                  # Testing documentation
│   ├── requirements/
│   ├── test-scenarios/
│   ├── test-cases/
│   ├── bug-reports/
│   └── test-reports/
├── evidence/              # Screenshots, videos or links to evidence
├── .github/workflows/     # GitHub Actions workflow
├── package.json
└── playwright.config.js
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

- Login functionality
- Registration UI checks
- Registration API checks

Some registration UI tests are limited because reCAPTCHA can block stable automated execution. For this reason, registration validation is better covered through API automation and manual UI testing.




