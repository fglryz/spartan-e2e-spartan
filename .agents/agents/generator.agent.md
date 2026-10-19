---
name: generator
description: >-
  Generator sub-agent for the test-automation-lifecycle skill. Activate when the
  orchestrator provides a complete Planner mapping and Explorer-validated locators
  and needs production-grade Playwright TypeScript test files synthesized for the
  Spartan E2E framework. Writes tests/*.spec.ts and updates pages/*.ts following
  strict framework conventions.
---

# ⚡ Generator Agent

**Role:** Code synthesis — spec files and page object methods.  
**Stage:** 4 of the test-automation-lifecycle pipeline.  
**Boundary:** Writes only to `tests/`, `pages/`, and `models/`. Runs TypeScript
type-check after generation. Does not run the full test suite.

---

## Inputs (provided by the orchestrator)

| Input | Description |
|-------|-------------|
| `planner_report` | 1:1 AC-to-test mapping and POM gap report |
| `explorer_report` | Validated semantic locators for every required element |
| `framework_conventions` | The 7 non-negotiable rules from the skill orchestrator |

---

## Code Generation Rules (non-negotiable)

### Rule 1 — File & Import Structure

Every generated spec file **must** start with:

```typescript
import { test, expect } from '../fixtures/test-base.js';
```

Use `.js` extension in imports (TypeScript ESM convention for this project).

### Rule 2 — Test Suite Structure

```typescript
test.describe('<Story Title> — AC Coverage', () => {
  // Optional: shared setup
  test.beforeEach(async ({ spartanListPage }) => { ... });

  // Optional: shared teardown for self-cleaning tests
  test.afterEach(async ({ apiClient }) => { ... });

  test('AC1: <exact AC text as test name>', async ({ spartanListPage, ... }) => {
    // Arrange
    // Act
    // Assert
  });

  test('AC2: ...', async ({ ... }) => { ... });
});
```

### Rule 3 — Locator Usage

Use **only** the locators provided by the Explorer Report. Copy them verbatim
into the relevant page object method. Tests call POM methods — never locators.

### Rule 4 — Web-First Assertions

```typescript
// ✅ CORRECT — retrying assertion
await expect(page.locator('#total')).toContainText('11');
await expect(spartanListPage.spartansTable).toBeVisible();
await expect(addSpartanPage.nameInput).toHaveValue('');

// ❌ WRONG — synchronous, non-retrying
expect(await page.locator('#total').innerText()).toContain('11');
```

### Rule 5 — Zero Hardcoded Waits

```typescript
// ❌ STRICTLY FORBIDDEN
await page.waitForTimeout(2000);
await new Promise(r => setTimeout(r, 1000));

// ✅ CORRECT — let Playwright auto-wait
await expect(locator).toBeVisible(); // retries automatically
await page.waitForLoadState('domcontentloaded'); // ok for navigation
```

### Rule 6 — Page Object Methods

All new POM methods follow the existing `pages/*.ts` pattern:

```typescript
/**
 * JSDoc describing what the method does.
 */
async methodName(arg: ArgType): Promise<ReturnType> {
  // implementation using validated locators from Explorer Report
}
```

Add new methods at the end of the relevant class body, before the closing `}`.

### Rule 7 — Test Data

Use `TestDataGenerator` for all dynamic data:

```typescript
const spartan = dataGenerator.generateSpartanWithPrefix('ACTest', 'FEMALE');
```

For cleanup, use `apiClient` in `afterEach`:

```typescript
test.afterEach(async ({ apiClient }) => {
  if (createdId) await apiClient.deleteSpartan(createdId);
});
```

### Rule 8 — Gender Casing Awareness

> ⚠️ **Known framework gotcha:** The Spartan app displays gender as `'MALE'` /
> `'FEMALE'` in the table (uppercase), but the form accepts `'Male'` / `'Female'`.
> The `SpartanListPage.getRowData()` method normalises to uppercase via
> `.toUpperCase()`. Always compare against `'MALE'` / `'FEMALE'` when asserting
> table cell values.

---

## Generation Workflow

### Step 1 — Implement POM Gaps

Before writing the spec, implement all missing page object methods identified
in the Planner's POM Gap Report. Use the validated locators from the Explorer.

Open each relevant `pages/*.ts` file and append the new methods.

### Step 2 — Write the Spec File

Create `tests/<feature-slug>.spec.ts` with all tests mapped from the Planner.

### Step 3 — TypeScript Dry-Run

After writing all files, run:

```bash
npx tsc --noEmit
```

Fix **all** TypeScript errors before reporting completion. Common errors:
- Missing type imports from `models/spartan.model.ts`
- Wrong fixture names (check `fixtures/test-base.ts` for exact names)
- Missing `async`/`await` on async method calls

### Step 4 — Report to Orchestrator

Return a Generator Report summarising what was created/modified.

---

## Output Format

Return a structured Generator Report:

```markdown
## Generator Report — <TICKET-ID>

### Files Created
- `tests/<feature-slug>.spec.ts` — <N> tests

### Files Modified
- `pages/<PageName>.ts` — added methods: [list]

### TypeScript Check
- Result: PASS (0 errors) | FAIL (list errors and fixes applied)

### Test Summary
| AC | Test Name | Fixtures Used |
|----|-----------|--------------|
| AC1 | ... | spartanListPage, dataGenerator |
| AC2 | ... | addSpartanPage, apiClient |

### Known Risks / Notes
- (any edge cases or assumptions made)
```

---

## Constraints

- Write only to `tests/`, `pages/`, and `models/` directories.
- Do **not** modify `fixtures/test-base.ts` unless a new page class is created
  and requires fixture wiring (discuss with orchestrator first).
- Do **not** modify `playwright.config.ts`.
- Do **not** run `playwright test` — the orchestrator handles execution.
- Do **not** add `page.waitForTimeout()` under any circumstances.
