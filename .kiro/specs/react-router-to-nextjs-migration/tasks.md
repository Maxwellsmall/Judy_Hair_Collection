# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - framer-motion SSR useContext Crash
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope to the concrete failing case — `"use client"` directive is NOT the literal first line (line 1) of the affected files
  - Check that `"use client"` is the literal first line (no blank lines, BOM, or comments before it) in `src/components/Testimonials.tsx`, `src/components/WhyChoseUs.tsx`, and `app/(site)/about/page.tsx`
  - The test assertions should match the Expected Behavior: `next build` exits with code 0 and no `useContext` TypeError
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found (e.g., blank line before `"use client"` in Testimonials.tsx)
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Non-framer-motion Components and API Routes Unaffected
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: `app/admin/layout.tsx` has `"use client"` on line 1 — this must remain unchanged
  - Observe: `next.config.js` exports a plain object with `reactStrictMode` and `images` — this structure must be preserved
  - Observe: `src/lib/whatsapp.ts` exports `generateWhatsAppLink` — this must remain importable
  - Write property-based test: for all files NOT in the affected set (`Testimonials.tsx`, `WhyChoseUs.tsx`, `about/page.tsx`, `next.config.js`), their content is unchanged after the fix
  - Verify test passes on UNFIXED code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 3. Fix framer-motion SSR crash and path alias

  - [x] 3.1 Ensure `"use client"` is the literal first line in Testimonials.tsx
    - Open `src/components/Testimonials.tsx`
    - Verify `"use client"` is on line 1 with no preceding blank lines, BOM, or comments
    - If any whitespace or content precedes it, move `"use client"` to be the absolute first line
    - _Bug_Condition: isBugCondition_framerMotion — component imports framer-motion without a valid client boundary at line 1_
    - _Expected_Behavior: next build completes with exit code 0, no useContext TypeError_
    - _Preservation: All framer-motion animations in Testimonials continue to play in the browser_
    - _Requirements: 1.1, 2.1, 3.1_

  - [x] 3.2 Ensure `"use client"` is the literal first line in WhyChoseUs.tsx
    - Open `src/components/WhyChoseUs.tsx`
    - Verify `"use client"` is on line 1 with no preceding blank lines, BOM, or comments
    - If any whitespace or content precedes it, move `"use client"` to be the absolute first line
    - _Bug_Condition: isBugCondition_framerMotion — component imports framer-motion without a valid client boundary at line 1_
    - _Expected_Behavior: next build completes with exit code 0, no useContext TypeError_
    - _Preservation: All framer-motion animations in WhyChoseUs continue to play in the browser_
    - _Requirements: 1.1, 2.1, 3.1_

  - [x] 3.3 Ensure `"use client"` is the literal first line in about/page.tsx
    - Open `app/(site)/about/page.tsx`
    - Verify `"use client"` is on line 1 with no preceding blank lines, BOM, or comments
    - If any whitespace or content precedes it, move `"use client"` to be the absolute first line
    - _Bug_Condition: isBugCondition_framerMotion — page directly imports framer-motion without a valid client boundary at line 1_
    - _Expected_Behavior: next build completes with exit code 0, no useContext TypeError_
    - _Preservation: All framer-motion animations on the about page continue to play in the browser_
    - _Requirements: 1.2, 2.2, 3.2_

  - [x] 3.4 Add explicit webpack @/ path alias to next.config.js
    - Open `next.config.js`
    - Add `const path = require('path');` at the top
    - Add a `webpack` function to `nextConfig` that sets `config.resolve.alias['@'] = path.resolve(__dirname, 'src')`
    - Preserve all existing `reactStrictMode` and `images` configuration
    - _Bug_Condition: isBugCondition_pathAlias — @/ alias used in CategoryCard.tsx but not explicitly configured in next.config.js_
    - _Expected_Behavior: next build resolves @/lib/whatsapp to src/lib/whatsapp.ts in all build contexts_
    - _Preservation: CategoryCard WhatsApp link generation continues to work correctly_
    - _Requirements: 1.5, 2.5, 3.6_

  - [x] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - framer-motion SSR useContext Crash Resolved
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms `"use client"` is correctly placed as line 1 in all three files
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** - Non-framer-motion Components and API Routes Unaffected
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

- [x] 4. Checkpoint - Ensure all tests pass
  - Run `next build` and verify exit code 0 with all pages successfully generated
  - Confirm no `TypeError: Cannot read properties of null (reading 'useContext')` in output
  - Confirm no `Module not found` errors for `@/lib/whatsapp`
  - Ensure all tests pass, ask the user if questions arise.
n