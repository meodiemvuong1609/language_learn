# Working Methodology

For every task:

1. Analyze existing implementation first.
2. Create a detailed implementation plan.
3. Implement incrementally.
4. After finishing each feature:
   - Run lint
   - Run type check
   - Run build
   - Run related tests
5. Fix every issue before moving to the next feature.
6. At the end, produce a summary report listing:
   - Files changed
   - Tests executed
   - Remaining technical debt
   - Suggested improvements

Never mark a task as complete if:
- Build fails
- Tests fail
- Lint fails
- TypeScript reports errors