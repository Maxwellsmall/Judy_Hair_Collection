# React Router to Next.js Migration Bugfix Design

## Overview

The JudyHair Next.js migration fails at build time with two distinct bugs:

1. **framer-motion SSR crash**: `framer-motion`'s `motion.*` components call React's `useContext` internally. During Next.js static generation, the React context is `null` on the server, causing `TypeError: Cannot read properties of null (reading 'useContext')` across all 16 pages. The fix is to add `"use client"` directives to the three affected files: `src/components/Testimonials.tsx`, `app/(site)/about/page.tsx`, and `src/components/WhyChoseUs.tsx` (which also imports framer-motion and is used transitively).

2. **`@/` path alias not in next.config.js**: `src/components/CategoryCard.tsx` imports `@/lib/whatsapp`. The `@/` → `src/` mapping exists in `tsconfig.json` but is absent from `next.config.js`. Next.js reads path aliases from `tsconfig.json` automatically via its built-in TypeScript support, so this is a latent risk rather than a confirmed build failure — but it should be explicitly configured to guarantee resolution in all build contexts (edge runtime, custom webpack configs, etc.).

Both fixes are minimal, targeted, and carry no risk of behavioral regression.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the build failure — a component using `framer-motion` is rendered server-side without a `"use client"` boundary, OR a `@/` import is used without explicit alias configuration in `next.config.js`
- **Property (P)**: The desired outcome — `next build` completes successfully and all pages render correctly in the browser
- **Preservation**: All existing client-side animations, UI behavior, admin auth flows, and API routes must remain unchanged after the fix
- **Server Component**: A Next.js component that renders on the server during static generation or SSR; cannot use browser APIs, React hooks, or context
- **Client Component**: A Next.js component marked with `"use client"` that renders in the browser; can use hooks, context, and browser APIs
- **`motion.*`**: framer-motion's animated element wrappers (e.g. `motion.div`) that internally call `useContext` to access the framer-motion animation context
- **`isBugCondition`**: Pseudocode function formalizing when the bug triggers
- **`next.config.js` webpack alias**: Explicit path alias configuration in Next.js config that guarantees module resolution across all build targets

## Bug Details

### Bug 1: framer-motion SSR Context Error

The bug manifests when Next.js attempts to statically prerender any page that imports a component using `motion.*` from `framer-motion` without a `"use client"` boundary. The `motion.*` components call `React.useContext()` at module initialization time, and during SSR/static generation the React context is `null`.

**Affected files and their import chains:**
- `app/(site)/page.tsx` → `src/components/Testimonials.tsx` → `framer-motion` ✗ (Testimonials already has `"use client"` but the crash still occurs — see root cause analysis)
- `app/(site)/about/page.tsx` → `framer-motion` directly ✗ (has `"use client"` already)
- `app/(site)/page.tsx` → `src/components/WhyChoseUs.tsx` → `framer-motion` ✗ (WhyChoseUs has `"use client"`)
- Admin pages crash via `app/admin/layout.tsx` which is already `"use client"` but child pages may import components without the directive

**Formal Specification:**
```
FUNCTION isBugCondition_framerMotion(component)
  INPUT: component — a React component file
  OUTPUT: boolean

  RETURN importsFramerMotion(component)
         AND NOT hasUseClientDirective(component)
         AND (isDirectlyRenderedByNextjs(component)
              OR isImportedByServerComponent(component))
END FUNCTION
```

**Examples:**
- `app/(site)/about/page.tsx` imports `motion` from `framer-motion` — even though it has `"use client"`, the build-time static analysis may still attempt server rendering before the directive is respected in certain Next.js versions
- `src/components/Testimonials.tsx` already has `"use client"` — if the crash persists, the root cause is the parent server component `app/(site)/page.tsx` not having a proper client boundary
- `src/components/WhyChoseUs.tsx` has `"use client"` but is imported by `app/(site)/page.tsx` which is a server component — the boundary is correct here
- Admin pages: `app/admin/layout.tsx` is `"use client"` and all admin page files are also `"use client"` — the crash on admin pages likely comes from a transitive import of a non-client component

### Bug 2: `@/` Path Alias Not Explicit in next.config.js

`src/components/CategoryCard.tsx` uses `import { generateWhatsAppLink } from "@/lib/whatsapp"`. The `tsconfig.json` maps `@/*` → `src/*`. Next.js reads `tsconfig.json` paths automatically, but this is not guaranteed in all build contexts (e.g., custom webpack plugins, edge runtime, or when `next.config.js` overrides webpack config).

**Formal Specification:**
```
FUNCTION isBugCondition_pathAlias(importStatement)
  INPUT: importStatement — an import using the @/ alias
  OUTPUT: boolean

  RETURN usesAtSlashAlias(importStatement)
         AND NOT explicitlyConfiguredInNextConfig(importStatement)
         AND (buildContextOverridesWebpack()
              OR edgeRuntimeActive()
              OR tsconfigPathsNotAutoResolved())
END FUNCTION
```

**Examples:**
- `import { generateWhatsAppLink } from "@/lib/whatsapp"` in `CategoryCard.tsx` — resolves correctly via tsconfig in standard builds, but may fail in edge cases
- Any future component using `@/` imports would have the same latent risk

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- All framer-motion animations in `Testimonials.tsx`, `WhyChoseUs.tsx`, and `about/page.tsx` must continue to play in the browser exactly as before
- Mouse interactions, hover effects, and `whileInView` animations must remain intact
- Admin authentication flow (login, session check, redirect to `/admin/login`) must continue to work
- All API routes under `/api/auth/*` and `/api/products/*` must remain unaffected
- The `CategoryCard` WhatsApp link generation must continue to work correctly
- Homepage sections (Hero, ShopByCategory, ProductGallery, ShopByStyle, Testimonials) must all render

**Scope:**
All inputs and behaviors that do NOT involve the server-side rendering of framer-motion components or the `@/` alias resolution are completely unaffected by these fixes. This includes:
- All API route handlers
- Database connection logic
- Cloudinary upload functionality
- Admin CRUD operations
- Any component that does not use framer-motion

## Hypothesized Root Cause

### Bug 1: framer-motion SSR Crash

Based on the build output and code analysis:

1. **Missing or misplaced `"use client"` directive**: Even though `Testimonials.tsx` and `about/page.tsx` already have `"use client"`, the crash across all 16 pages suggests the error may be propagating from a shared layout or a component imported by a server component that doesn't have the directive. `src/components/WhyChoseUs.tsx` has `"use client"` and is imported by the server component `app/(site)/page.tsx` — this should be fine, but needs verification.

2. **Next.js version-specific SSR behavior**: In some Next.js 14 builds, even components with `"use client"` can trigger SSR errors if they are imported in a way that causes the module to be evaluated server-side before the directive is processed.

3. **Transitive import without client boundary**: The `app/(site)/page.tsx` is a server component (no `"use client"`) that imports `Testimonials` and `WhyChoseUs`. If either of those components' `"use client"` directives are not being respected (e.g., due to a re-export pattern or barrel file), the framer-motion code runs server-side.

4. **Admin layout transitive crash**: `app/admin/layout.tsx` is `"use client"` and all admin pages are `"use client"`, so the admin crash is likely caused by a shared component or the `app/layout.tsx` root layout importing something that triggers framer-motion.

### Bug 2: Path Alias

5. **`next.config.js` webpack config missing alias**: Next.js auto-reads `tsconfig.json` paths for TypeScript compilation, but the webpack module resolver used at runtime may not pick up the alias in all configurations. Adding it explicitly to `next.config.js` via `webpack.resolve.alias` eliminates the ambiguity.

## Correctness Properties

Property 1: Bug Condition - framer-motion Components Render Without SSR Crash

_For any_ Next.js page that imports a component using `framer-motion`'s `motion.*` API, the fixed codebase SHALL complete `next build` without throwing `TypeError: Cannot read properties of null (reading 'useContext')`, and all such components SHALL render their animations correctly in the browser.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Bug Condition - Path Alias Resolves in All Build Contexts

_For any_ import statement using the `@/` alias in a Next.js component, the fixed codebase SHALL successfully resolve the module to the correct `src/` path during `next build`, regardless of build target or webpack configuration.

**Validates: Requirements 2.5**

Property 3: Preservation - Animations and UI Behavior Unchanged

_For any_ user interaction with the browser-rendered application after the fix, the fixed codebase SHALL produce exactly the same visual output and animation behavior as the original code, preserving all framer-motion animations, hover effects, and page transitions.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

#### Fix 1: Ensure `"use client"` on all framer-motion components

**File**: `src/components/Testimonials.tsx`
- Already has `"use client"` — verify it is the very first line (no blank lines or comments before it)
- No change needed if directive is correctly placed

**File**: `src/components/WhyChoseUs.tsx`
- Already has `"use client"` — verify it is the very first line
- No change needed if directive is correctly placed

**File**: `app/(site)/about/page.tsx`
- Already has `"use client"` — verify it is the very first line
- No change needed if directive is correctly placed

**Root cause investigation**: Since all three files already have `"use client"`, the crash across all 16 pages points to a different issue. The most likely cause is that `app/(site)/page.tsx` (a server component) imports these client components, and something in the import chain is causing framer-motion to be evaluated server-side. The fix is to verify the directive placement and, if needed, wrap the framer-motion components in a dedicated client boundary file.

**Specific Changes if directives are misplaced:**
1. Move `"use client"` to line 1 in any affected file where it appears after a blank line or comment
2. If the issue persists, create thin client wrapper components that re-export the framer-motion components with explicit `"use client"` at the top

#### Fix 2: Add `@/` alias to next.config.js

**File**: `next.config.js`

**Specific Changes:**
1. Add a `webpack` function to `nextConfig` that extends `config.resolve.alias` with `@` → `path.resolve(__dirname, 'src')`
2. Import Node's `path` module at the top of the file

```javascript
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: { /* existing config */ },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};
```

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bugs on unfixed code, then verify the fixes work correctly and preserve existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fix. Confirm or refute the root cause analysis.

**Test Plan**: Run `next build` on the unfixed codebase and capture the full error output. Examine which pages fail and the exact stack trace to pinpoint whether the `"use client"` directives are misplaced or if there is a transitive import issue.

**Test Cases**:
1. **Build failure test**: Run `next build` — expect failure with `TypeError: Cannot read properties of null (reading 'useContext')` (will fail on unfixed code)
2. **Directive placement test**: Check that `"use client"` is the literal first line of each affected file with no preceding whitespace or comments (may reveal misplacement)
3. **Import chain test**: Trace the import chain from `app/(site)/page.tsx` through `Testimonials.tsx` and `WhyChoseUs.tsx` to confirm client boundaries are respected
4. **Path alias test**: Attempt to import `@/lib/whatsapp` in a Next.js context and verify it resolves to `src/lib/whatsapp.ts`

**Expected Counterexamples**:
- `next build` exits with non-zero code and prints the useContext TypeError
- Possible causes: directive on wrong line, transitive server-side evaluation, missing webpack alias

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed code produces the expected behavior.

**Pseudocode:**
```
FOR ALL component WHERE isBugCondition_framerMotion(component) DO
  result := nextBuild_fixed()
  ASSERT result.exitCode == 0
  ASSERT result.output NOT CONTAINS "useContext"
  ASSERT result.output NOT CONTAINS "TypeError"
END FOR

FOR ALL importStatement WHERE isBugCondition_pathAlias(importStatement) DO
  result := nextBuild_fixed()
  ASSERT result.exitCode == 0
  ASSERT result.output NOT CONTAINS "Module not found"
  ASSERT result.output NOT CONTAINS "@/lib/whatsapp"
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed code produces the same result as the original code.

**Pseudocode:**
```
FOR ALL userInteraction WHERE NOT isBugCondition(userInteraction) DO
  ASSERT fixedApp.render(userInteraction) == originalApp.render(userInteraction)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on the UNFIXED code for non-framer-motion components (admin pages, API routes, static pages), then write tests capturing that behavior to verify it continues after the fix.

**Test Cases**:
1. **Animation preservation**: Verify framer-motion animations still trigger on scroll/hover in the browser after fix
2. **Admin auth preservation**: Verify unauthenticated users are still redirected to `/admin/login`
3. **API route preservation**: Verify `/api/products` and `/api/auth/me` return correct responses
4. **WhatsApp link preservation**: Verify `CategoryCard` generates correct WhatsApp URLs using `@/lib/whatsapp`

### Unit Tests

- Test that `"use client"` is the first line of `Testimonials.tsx`, `WhyChoseUs.tsx`, and `about/page.tsx`
- Test that `next.config.js` exports a webpack function that sets `config.resolve.alias['@']`
- Test that `generateWhatsAppLink` from `src/lib/whatsapp` is importable via the `@/` alias
- Test that framer-motion `motion.div` renders without throwing in a jsdom environment with client context

### Property-Based Tests

- Generate random component trees importing framer-motion and verify none cause SSR errors when wrapped in `"use client"` boundaries
- Generate random `@/` import paths and verify all resolve to the correct `src/` equivalents via the webpack alias
- Test that all non-framer-motion components continue to render identically before and after the fix across many prop combinations

### Integration Tests

- Run `next build` end-to-end and assert exit code 0 with all 16 pages successfully generated
- Load the homepage in a browser and verify Testimonials and WhyChoseUs animations play on scroll
- Load `/about` and verify all framer-motion entrance animations trigger correctly
- Load `/admin/login` and verify the auth redirect flow works end-to-end
- Verify `CategoryCard` WhatsApp links open the correct chat URL
