name	pr-reviewer
description	Pull Request Review Skill that performs an automated, senior-level code review on the active branch or PR diff against Playwright TypeScript, POM, and security best practices.
command	/pr-reviewer [pr-number-or-branch]
parameters	
target
type	description	required
string
The PR number (e.g. 14) or git branch name. Defaults to current branch against main.
false
PR Reviewer Skill (/pr-reviewer)
The /pr-reviewer skill performs a comprehensive, automated SDET code review on pull requests or working branches.

🎯 Review Evaluation Checklist
Locator Strategy:
Are locators following Playwright's user-facing locator hierarchy (getByRole, getByLabel, etc.)?
Are there any absolute XPaths (/html/body/...)? (Strictly forbidden)
Page Object Model (POM) Discipline:
Are locators and UI actions properly encapsulated in pages/?
Are there any assertions placed inside Page Objects? (Forbidden; assertions belong in test specs).
Synchronization & Timing:
Are there any hardcoded timeouts (page.waitForTimeout(...) or setTimeout)? (Forbidden).
Are web-first retrying assertions (await expect(locator)...) used everywhere?
Data Isolation & Concurrency:
Are tests using DataGenerator (@faker-js/faker) rather than static hardcoded names or phone numbers?
API & Contract Integrity:
Are REST API tests using SpartanApiClient and typed wrappers (ResponseWrapper<T>)?
Type Safety:
Does npm run typecheck pass with zero errors?