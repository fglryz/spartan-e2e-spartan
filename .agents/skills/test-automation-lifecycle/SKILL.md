---
name: test-automation-lifecycle
description: >-
  Master orchestrator for the Spartan E2E autonomous test generation pipeline.
  Activate this skill when the user provides a Jira ticket ID (e.g. SPAR-42) or
  an Azure DevOps work item ID (e.g. #1234) and wants end-to-end Playwright
  TypeScript tests generated, verified, and self-healed automatically. The skill
  coordinates four specialized sub-agents: Planner → Explorer → Generator →
  Healer, and runs the full lifecycle from story ingestion to a passing test suite.
---

# 🚀 Test Automation Lifecycle — Master Orchestrator

> **Usage:** `/test-automation-lifecycle <TICKET-ID>`
>
> **Examples:** `/test-automation-lifecycle SPAR-42`  · `/test-automation-lifecycle #1234`

---
Test Automation Lifecycle Skill (Master Orchestrator)
The /test-automation-lifecycle skill is the central master orchestrator of our Playwright + TypeScript test automation framework. When triggered with a Jira Issue Key (e.g. /test-automation-lifecycle SPAR-101) or Azure DevOps Work Item ID (e.g. /test-automation-lifecycle 10423), it coordinates the 4 specialized sub-agents and the /pr-summary skill through an end-to-end automation workflow on an isolated git branch, transforming user story acceptance criteria into verified, production-ready tests and an open Pull Request.

💡 Visual Architecture: Open WORKFLOW.html in your browser for the interactive visual workflow dashboard, sub-agent dossiers, 1-to-1 AC mapping matrix, and failure classification simulator.

🔄 The 9-Stage Orchestration Pipeline
[1. Target Ingestion] ──────► Atlassian MCP / Azure DevOps MCP ──► Parses Story Narrative & ACs
            │
            ▼
[2. Git Branch Isolation] ──► Switches to main ──► Creates feature/<target-id>-automation
            │
            ▼
[3. Planner Agent] ─────────► Enforces 1-to-1 AC Mapping ──► POM & API Service Gap Analysis
            │
            ▼
[4. Explorer Agent] ────────► Playwright MCP & Browser Agent ──► Audits DOM & Swagger REST API
            │
            ▼
[5. Generator Agent] ───────► Synthesizes tests/*.spec.ts, pages/*.ts, services/*.ts
            │
            ▼
[6. Playwright Execution] ──► Runs npm run typecheck ──► npx playwright test <target>
            │
       ┌────┴────┐
    [Pass]    [Fail]
       │         │
       │         ▼
       │  [7. Healer Agent] ──► Inspects traces, screenshots, and logs ──► Autonomously patches code
       │         │
       ▼         ▼
[8. Ephemeral Cleanup] ─────► Automatically purges temporary scratch files (.temp/)
            │
            ▼
[9. PR Summary & Creation] ─► Invokes /pr-summary skill to draft rich PR description
                              Opens Pull Request via GitHub MCP for peer review
📋 Detailed Stage Breakdown
Stage 1: Work Item & Requirements Ingestion (Atlassian MCP / Azure DevOps MCP)
Takes the user input parameter target (e.g. SPAR-101, 10423).
Atlassian Jira Integration: Calls jira_get_issue(issueKey) via Atlassian MCP to extract:

Story summary & description.

Acceptance Criteria (AC1: ..., AC2: ..., etc.).
Issue type, labels, priority.
Azure DevOps Integration: Calls azure_devops_get_work_item(id) via Azure DevOps MCP to extract fields, criteria, and tags.
Fallback / Inline AC: If MCP servers are offline or the user provides raw AC text directly in the command prompt, parses the acceptance criteria directly.
Classifies Scope: Determines whether the story requires UI tests (tests/*.spec.ts), API tests (tests/api/*.spec.ts), or a Hybrid E2E workflow.

# Stage 2: Git Branch Isolation
Checks current repository status (git status).
Ensures working tree is clean.
Switches to main branch first and creates a dedicated branch:
git checkout -B feature/<target-id>-automation main
Guarantees each automation task begins from a clean baseline and never inherits unmerged artifacts from other feature branches.

# Stage 3: Planner Agent (1-to-1 AC Mapping & Gap Audit)
Invokes .agents/agents/planner.agent.md.
Enforces 1-to-1 AC Traceability:
AC1 ➜ test('AC1: ...')
AC2 ➜ test('AC2: ...')
Zero combining or skipping of acceptance criteria.
POM & API Service Gap Analysis:
Scans pages/ (HomePage.ts, SpartanListPage.ts, AddSpartanPage.ts, EditSpartanPage.ts, SpartanDetailsPage.ts) for reusable locators and action methods.
Scans services/ (SpartanApiClient.ts) and test-data/ (spartanData.ts) for reusable endpoints and DTOs.
Generates an in-memory gap matrix listing missing elements or methods to be implemented.
Dynamic Data Strategy: Maps inputs to DataGenerator (@faker-js/faker) to avoid hardcoded static data.

# Stage 4: Explorer Agent (Live DOM & Swagger API Exploration)
Invokes .agents/agents/explorer.agent.md.
Connects to the live Spartan Web Application (/web/v2/spartans) and Swagger UI (/swagger-ui/index.html#/) using Playwright MCP or browser subagent tools.
Audits live DOM accessibility tree to select resilient semantic selectors (getByRole, getByLabel, getByPlaceholder, getByText, ID fallback).
Verifies selector uniqueness (count() === 1).
Validates backend endpoint schemas, query parameters, and response structures (ResponseWrapper).
# Stage 5: Generator Agent (Code Synthesis)
Invokes .agents/agents/generator.agent.md.
Test Spec Synthesis:
Implements the 1-to-1 AC test suite in tests/<feature>.spec.ts or tests/api/<feature>.spec.ts.
Injects custom fixtures (import { test, expect } from '../fixtures').
Page Object & Service Updates:
Adds missing locators and action methods to pages/<PageName>.ts extending BasePage.ts.
Zero assertions in Page Objects. Verification belongs in test spec files.
Adds any new REST endpoint methods to services/SpartanApiClient.ts.
Enforces Playwright Standards:
Web-first retrying assertions (await expect(locator).toBeVisible()).
Zero hardcoded sleeps (page.waitForTimeout and setTimeout strictly banned).
# Stage 6: Playwright Execution & Typecheck
Type Safety Validation: Runs npm run typecheck to verify zero TypeScript errors.
Targeted Test Execution: Runs npx playwright test <target-spec> --project=chromium.
Evaluates test results, duration, and generated artifacts in test-results/ and playwright-report/.
# Stage 7: Autonomous Healing (Conditional)
If any test fails:
Invokes .agents/agents/healer.agent.md with error logs, trace zip, and screenshots.
Classifies root cause using the strict 3-Tier Taxonomy:
automation-code: Autonomously patches POM, service, or test spec, and re-executes.
environment data: Logs environment discrepancy and halts healing.
product defect: Logs formal bug report with reproduction steps and halts healing.
# Stage 8: Ephemeral Scratch Purge
Upon 100% test pass verification, purges any temporary scratch folders (.temp/).
#Stage 9: PR Summary & Pull Request Creation (/pr-summary)
Automatically invokes the /pr-summary skill:
Analyzes git diff, execution metrics, and 1-to-1 AC traceability checklist.
Generates an executive Pull Request description.
Uses GitHub MCP to commit changes, push the branch, and open a Pull Request ready for peer review.
🚀 How to Execute the Skill
With Jira Issue Key:
agy> /test-automation-lifecycle SPAR-101
agy> /test-automation-lifecycle CYDEO-204
With Azure DevOps Work Item ID:
agy> /test-automation-lifecycle 10423
agy> /test-automation-lifecycle 20851
With Direct Acceptance Criteria:
agy> /test-automation-lifecycle "Story: Filter Spartans by Gender. AC1: Selecting Male filters table to Male only. AC2: Total count updates accordingly."