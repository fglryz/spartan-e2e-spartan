# Spartan Web E2E Test Automation Framework

A modern, production-grade UI Test Automation Framework for the [Spartan Web Application](https://spartan-app-new-nonsecure.onrender.com/) built with **Playwright**, **TypeScript**, and the **Page Object Model (POM)** design pattern.

---

## 📁 Framework Architecture & Folder Structure

```text
spartan-e2e-spartan/
├── pages/                  # Page Object Model classes (locators & actions)
│   ├── BasePage.ts         # Common navigation, headers, alerts, and shared assertions
│   ├── HomePage.ts         # Home page (/web/v2/home)
│   ├── SpartanListPage.ts  # Spartans table, client-side search/filter, and row actions
│   ├── AddSpartanPage.ts   # Spartan registration form (/web/v2/spartans/add)
│   ├── EditSpartanPage.ts  # Spartan edit form (/web/v2/spartans/edit/{id})
│   ├── SpartanDetailPage.ts# Spartan profile / details view (/web/v2/spartans/{id})
│   └── index.ts            # Barrel export for clean page imports
├── tests/                  # Playwright Test specification files
│   ├── navigation.spec.ts          # Smoke tests for navigation, header, and routing
│   ├── spartan-list-search.spec.ts # Table headers, name substring search & gender filters
│   ├── spartan-create.spec.ts      # Male/Female registration & cancel navigation
│   ├── spartan-detail.spec.ts      # Profile details verification & back navigation
│   ├── spartan-edit.spec.ts        # Pre-population check & update lifecycle
│   ├── spartan-delete.spec.ts      # Deletion lifecycle & total count decrement check
│   └── spartan-e2e-crud.spec.ts    # Complete user journey (Create -> Search -> View -> Edit -> Delete)
├── utilities/              # Reusable helper utilities
│   ├── test-data-generator.ts # Realistic Faker-based data generator
│   ├── browser-utils.ts       # Dialog handling, scroll, and load state utilities
│   └── logger.ts              # Structured test step logger
├── fixtures/               # Playwright custom test fixture extensions
│   └── test-base.ts        # Injects instantiated Page Objects into test signatures
├── models/                 # TypeScript interfaces and domain models
│   └── spartan.model.ts    # Spartan, SpartanFormData, SpartanRowData interfaces
├── .env                    # Active environment configuration
├── .env.example            # Environment configuration template
├── playwright.config.ts    # Centralized Playwright configuration
├── tsconfig.json           # TypeScript configuration with strict mode and path aliases
└── package.json            # Scripts and dependencies
```

---

## 🚀 Key Framework Design Highlights

1. **Page Object Model (POM)**:
   - Locators and page interactions are strictly isolated within the `pages/` directory.
   - Tests remain clean, concise, and focused purely on business logic and assertions.

2. **Playwright Fixtures (`fixtures/test-base.ts`)**:
   - Implements Playwright's recommended fixture pattern (`test.extend<SpartanFixtures>()`).
   - Page objects (`homePage`, `spartanListPage`, `addSpartanPage`, etc.) are lazily instantiated and injected directly into test arguments, eliminating repetitive `new Page()` boilerplate.

3. **Dynamic Test Data Generation (`utilities/test-data-generator.ts`)**:
   - Uses `@faker-js/faker` to generate valid, realistic names and 10-digit phone numbers adhering to the Spartan application schema.
   - Generates unique prefix-tagged records (`MaleTest...`, `DelTest...`, `E2EInit...`) to prevent collisions on shared test environments.

4. **Self-Cleaning Tests**:
   - Creation and edit tests include `afterEach` hooks that automatically delete temporary test records created during test runs.

5. **Client-Side Filtering Support**:
   - Handles the Spartan application's dynamic in-memory client-side table filtering (`display: none` toggle) using `:not([style*="display: none"])` visibility filters.

---

## 🛠️ Quick Start & Execution

### 1. Installation
```bash
npm install
npx playwright install chromium
```

### 2. Run Tests
```bash
# Run all tests in headless mode
npm test

# Run tests in headed browser mode
npm run test:headed

# Run with Playwright Interactive UI Mode
npm run test:ui

# Run specific browser projects
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### 3. View HTML Test Report
```bash
npm run test:report
```

### 4. Type Checking
```bash
npm run typecheck
```
