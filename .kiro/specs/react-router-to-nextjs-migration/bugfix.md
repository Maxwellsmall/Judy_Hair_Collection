# Bugfix Requirements Document

## Introduction

The JudyHair website is being migrated from a Vite/React Router setup to Next.js 14 App Router. The migration is partially complete — the `app/` directory exists with Next.js pages and layouts, and `src/components/` contains the original React components now imported by those pages. However, `next build` fails across all 16 pages with `TypeError: Cannot read properties of null (reading 'useContext')`. The root cause is that `framer-motion` (used in `src/components/Testimonials.tsx` and `app/(site)/about/page.tsx`) calls React's `useContext` during Next.js static page generation (SSR), where the React context is `null`. Additionally, `src/components/CategoryCard.tsx` uses the `@/lib/whatsapp` path alias which resolves to `src/lib/whatsapp` — this works in the tsconfig but can fail at runtime in certain Next.js build contexts. These issues prevent the app from building or deploying.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN Next.js statically prerenders any page that imports `src/components/Testimonials.tsx` (e.g. the homepage `/`) THEN the system crashes with `TypeError: Cannot read properties of null (reading 'useContext')` because `framer-motion`'s `motion` components call `useContext` during server-side rendering where React context is `null`

1.2 WHEN Next.js statically prerenders `app/(site)/about/page.tsx` which directly uses `framer-motion`'s `motion` components THEN the system crashes with the same `TypeError: Cannot read properties of null (reading 'useContext')` error during static page generation

1.3 WHEN Next.js statically prerenders any admin page (e.g. `/admin/dashboard`, `/admin/login`, `/admin/products`, `/admin/upload`, `/admin/settings`) THEN the system crashes with `TypeError: Cannot read properties of null (reading 'useContext')` because the admin layout imports components that transitively trigger the framer-motion context error

1.4 WHEN Next.js statically prerenders the `/_not-found` page THEN the system crashes with `TypeError: Cannot read properties of null (reading 'useContext')` for the same reason

1.5 WHEN `src/components/CategoryCard.tsx` is imported in a Next.js build THEN the system may fail to resolve the `@/lib/whatsapp` import because the `@/` alias maps to `src/` in tsconfig but this alias is not explicitly configured in `next.config.js`

### Expected Behavior (Correct)

2.1 WHEN Next.js statically prerenders any page that imports `src/components/Testimonials.tsx` THEN the system SHALL render the page successfully by treating the component as a client component, preventing framer-motion from executing during SSR

2.2 WHEN Next.js statically prerenders `app/(site)/about/page.tsx` THEN the system SHALL render the page successfully without crashing, with framer-motion animations executing only on the client side

2.3 WHEN Next.js statically prerenders any admin page THEN the system SHALL render the page successfully (or skip static generation for auth-protected pages) without crashing

2.4 WHEN Next.js statically prerenders the `/_not-found` page THEN the system SHALL render it successfully without crashing

2.5 WHEN `src/components/CategoryCard.tsx` is imported in a Next.js build THEN the system SHALL successfully resolve the `@/lib/whatsapp` import via the configured path alias

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user visits the homepage `/` in the browser THEN the system SHALL CONTINUE TO display the Hero, ShopByCategory, ProductGallery, ShopByStyle, and Testimonials sections with animations intact

3.2 WHEN a user visits `/about` in the browser THEN the system SHALL CONTINUE TO display the about page with all framer-motion animations working as expected

3.3 WHEN a user visits `/hairstyles` in the browser THEN the system SHALL CONTINUE TO display the products grid with filtering and sorting functionality

3.4 WHEN a logged-in admin user visits `/admin/dashboard` THEN the system SHALL CONTINUE TO display the dashboard with stats and quick actions

3.5 WHEN an unauthenticated user visits any `/admin/*` page THEN the system SHALL CONTINUE TO redirect them to `/admin/login`

3.6 WHEN the Next.js build completes successfully THEN the system SHALL CONTINUE TO serve all API routes under `/api/auth/*` and `/api/products/*` without regression
