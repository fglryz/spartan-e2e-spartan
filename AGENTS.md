# Spartan E2E — Agent Rules

This file defines always-on rules and project context for all Antigravity
agent interactions within this repository.

---

## Project Identity

This is the **Spartan E2E Test Automation Framework** — a Playwright +
TypeScript test suite for the Spartan web application, following the
**Page Object Model (POM)** design pattern.

- **Language:** TypeScript (strict mode, ESM)
- **Test Runner:** Playwright Test
- **Application under test:** `https://spartan-app-new-nonsecure.onrender.com`
- **Domain:** Spartan CRUD (Create, Read, Update, Delete) operations

---

## Mandatory Coding Standards

All code produced by agents in this repository **must** follow these rules:

### 1. Import Extensions
Always use `.js` extensions in TypeScript imports (ESM convention):
```typescript
// ✅ Correct
import { test, expect } from '../fixtures/test-base.js';
import { SpartanListPage } from '../pages/SpartanListPage.js';

// ❌ Wrong
import { test } from '../fixtures/test-base';
```

### 2. Fixture Usage
All tests must use the custom test fixture from `fixtures/test-base.ts`:
```typescript
import { test, expect } from '../fixtures/test-base.js';
```

### 3. No Hardcoded Waits
`page.waitForTimeout()` and `setTimeout()` are **strictly forbidden**.
Use Playwright's built-in auto-waiting and retrying assertions.

### 4. Web-First Assertions Only
All assertions must use retrying matchers:
```typescript
await expect(locator).toBeVisible();    // ✅
await expect(locator).toContainText();  // ✅
expect(await locator.innerText())       // ❌ non-retrying
```

### 5. Locator Resilience
Prefer semantic locators in this order:
1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByText()`
5. `locator('#stable-id')` — only for known stable IDs

**Absolute XPaths are banned.**

### 6. Gender Casing Awareness
The Spartan app uses `'MALE'`/`'FEMALE'` in the database and table cells.
Form selects use `'Male'`/`'Female'` (title-case). `getRowData()` always
returns uppercase. Assert table gender values as `'MALE'` or `'FEMALE'`.

---

## Agentic Skills Available

This project has a custom agentic skill:

- **`test-automation-lifecycle`** — Autonomous test generation pipeline.
  Provide a Jira ID (e.g. `SPAR-42`) or Azure DevOps ID (e.g. `#1234`) and
  the skill orchestrates Planner → Explorer → Generator → Healer agents to
  produce verified, self-healing Playwright tests from user story ACs.

  Configuration: `.agents/skills/test-automation-lifecycle/SKILL.md`

---

## Agent Configuration Files

| Agent | File |
|-------|------|
| Planner | `.agents/agents/planner.agent.md` |
| Explorer | `.agents/agents/explorer.agent.md` |
| Generator | `.agents/agents/generator.agent.md` |
| Healer | `.agents/agents/healer.agent.md` |
