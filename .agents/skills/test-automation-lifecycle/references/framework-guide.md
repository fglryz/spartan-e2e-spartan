# Spartan E2E Framework — Architecture Reference

> This reference is used by all agents in the test-automation-lifecycle pipeline.
> Read it to understand the framework conventions before generating or inspecting code.

---

## Project Structure

```
spartan-e2e-spartan/
├── .agents/                          ← Antigravity agentic customizations
│   ├── agents/
│   │   ├── planner.agent.md          ← Planner sub-agent instructions
│   │   ├── explorer.agent.md         ← Explorer sub-agent instructions
│   │   ├── generator.agent.md        ← Generator sub-agent instructions
│   │   └── healer.agent.md           ← Healer sub-agent instructions
│   └── skills/
│       └── test-automation-lifecycle/
│           ├── SKILL.md              ← Master orchestrator (this skill)
│           └── references/
│               └── framework-guide.md ← (this file)
├── pages/                            ← Page Object Model classes
│   ├── BasePage.ts                   ← Navigation, header, shared assertions
│   ├── HomePage.ts                   ← /web/v2/home
│   ├── SpartanListPage.ts            ← /web/v2/spartans (table, search, filter)
│   ├── AddSpartanPage.ts             ← /web/v2/spartans/add
│   ├── EditSpartanPage.ts            ← /web/v2/spartans/edit/{id}
│   ├── SpartanDetailPage.ts          ← /web/v2/spartans/{id}
│   └── index.ts                      ← Barrel export
├── tests/                            ← Playwright spec files
│   ├── navigation.spec.ts
│   ├── spartan-list-search.spec.ts
│   ├── spartan-create.spec.ts
│   ├── spartan-detail.spec.ts
│   ├── spartan-edit.spec.ts
│   ├── spartan-delete.spec.ts
│   └── spartan-e2e-crud.spec.ts
├── fixtures/
│   └── test-base.ts                  ← Custom Playwright fixture extensions
├── models/
│   └── spartan.model.ts              ← TypeScript interfaces
├── services/
│   └── spartan-api-client.ts         ← REST API client for setup/teardown
├── utilities/
│   ├── test-data-generator.ts        ← Faker-based data generator
│   ├── browser-utils.ts              ← Dialog handling, scroll utilities
│   └── logger.ts                     ← Structured test step logger
├── .env                              ← Active environment config
├── playwright.config.ts              ← Playwright configuration
└── package.json                      ← Scripts and dependencies
```

---

## Application Under Test

- **Base URL:** `https://spartan-app-new-nonsecure.onrender.com` (configurable via `BASE_URL` in `.env`)
- **Technology:** REST API + Web UI (traditional HTML, no SPA framework)
- **Key Routes:**
  - `/web/v2/home` — Home page
  - `/web/v2/spartans` — Spartan list with client-side search/filter
  - `/web/v2/spartans/add` — Create form
  - `/web/v2/spartans/{id}` — Detail view
  - `/web/v2/spartans/edit/{id}` — Edit form
  - `/api/spartans` — REST API endpoint

---

## The Spartan Domain Model

```typescript
// models/spartan.model.ts
export type SpartanGender = 'MALE' | 'FEMALE';

export interface SpartanFormData {
  name: string;
  phone: string;
  gender: SpartanGender;
}

export interface SpartanRowData {
  id: string;
  name: string;
  phone: string;
  gender: SpartanGender; // Always uppercase in getRowData()
}
```

---

## Available Fixtures (test-base.ts)

| Fixture Name | Type | Description |
|-------------|------|-------------|
| `homePage` | `HomePage` | Home page POM |
| `spartanListPage` | `SpartanListPage` | Spartan table + search/filter POM |
| `addSpartanPage` | `AddSpartanPage` | Create Spartan form POM |
| `spartanDetailPage` | `SpartanDetailPage` | Detail view POM |
| `editSpartanPage` | `EditSpartanPage` | Edit form POM |
| `apiClient` | `SpartanApiClient` | REST API client |
| `dataGenerator` | `typeof TestDataGenerator` | Static data generator class |

---

## TestDataGenerator Usage

```typescript
// Generates a Spartan with a prefix, gender, and random Faker data
const spartan = dataGenerator.generateSpartanWithPrefix('TestPrefix', 'MALE');
// Returns: { name: 'TestPrefix_FakerName', phone: '5551234567', gender: 'MALE' }
```

---

## Key Framework Gotchas

### 1. Gender Casing
The Spartan app stores and displays gender as `'MALE'` / `'FEMALE'` in the table,
but the form's `<select>` uses option values `'Male'` / `'Female'` (title-case).

`SpartanListPage.getRowData()` normalizes via `.toUpperCase()`, so:
- When calling `createSpartan({ gender: 'MALE' })`, the POM handles title-casing internally
- When asserting `rowData.gender`, always compare with `'MALE'` or `'FEMALE'`

### 2. Client-Side Filtering
The Spartan list page uses JavaScript to hide rows (`display: none`) rather than
removing them. Always use `visibleTableRows` locator (`:not([style*="display: none"])`)
when interacting with filtered results.

### 3. Single Worker
`playwright.config.ts` sets `workers: 1` to avoid database race conditions on
the shared Render instance. Tests run sequentially — do not attempt parallelism.

### 4. Self-Cleaning Tests
Tests that create Spartans must clean up after themselves. Use `afterEach` with
`apiClient.deleteSpartan(id)` to avoid polluting the shared database.

### 5. Browser Dialog Handling
The Delete action triggers a native browser `confirm()` dialog.
The `SpartanListPage.clickDeleteByName()` method handles this automatically.
If writing new delete-related tests, ensure dialog acceptance is handled.

---

## npm Scripts Reference

```bash
npm test                    # All tests, headless, all browsers
npm run test:api            # API tests only
npm run test:ui-specs       # UI spec tests only
npm run test:chromium       # Chromium browser only
npm run test:firefox        # Firefox browser only
npm run test:webkit         # Safari/WebKit browser only
npm run test:headed         # Headed mode (visible browser)
npm run test:debug          # Debug mode with Playwright Inspector
npm run test:report         # Open last HTML report
npm run typecheck           # TypeScript type check only
```

---

## Playwright Configuration Highlights

- **Timeout:** 30,000ms default (configurable via `DEFAULT_TIMEOUT` env)
- **Retries:** 1 locally, 2 in CI
- **Reporters:** `list` + `html` (output to `playwright-report/`)
- **Trace:** `on-first-retry`
- **Screenshots:** `only-on-failure`
- **Video:** `retain-on-failure`
