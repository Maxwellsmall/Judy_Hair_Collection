# Implementation Plan: Product Detail & Reviews

## Overview

Incremental implementation starting from the data layer, then API routes, then UI components. Each task builds on the previous so there is no orphaned code.

## Tasks

- [x] 1. Update Product model with video support
  - Add `videos?: string[]` to the `IProduct` interface in `app/models/Product.ts`
  - Add `videos` field to `productSchema`: `type: [String]`, `default: []`, validator rejecting arrays longer than 5
  - _Requirements: 6.1, 6.2_

  - [ ]* 1.1 Write property test for videos array validation
    - **Property 11: Videos array validation rejects more than 5 entries**
    - **Validates: Requirements 6.2**

- [x] 2. Create Review model
  - Create `app/models/Review.ts` with `IReview` interface and `reviewSchema`
  - Fields: `reviewerName` (String, required, maxlength 100), `rating` (Number, required, integer 1–5), `body` (String, required, maxlength 500), `approved` (Boolean, default false), `adminResponse` (String, optional, maxlength 1000)
  - Enable `timestamps: true`
  - Add compound index `{ approved: 1, createdAt: -1 }`
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [ ]* 2.1 Write property test for Review model validation
    - **Property 12: Review model rejects invalid field values**
    - **Validates: Requirements 8.3, 8.4, 8.5**

- [x] 3. Update upload API for video support
  - In `app/api/upload/single/route.ts`, read optional `type` form field (`'image' | 'video'`)
  - When `type === 'video'`: use `resource_type: 'video'`, folder `judy-hair/products/videos`, accept `formData.get('file')` or `formData.get('image')`
  - Default (no type or `type === 'image'`): existing image upload behaviour unchanged
  - _Requirements: 6.5_

- [x] 4. Create Review API routes
  - Create `app/api/reviews/route.ts`:
    - `GET`: public, query only `approved: true`, sort `createdAt: -1`, respect `?limit` param (default 6, max 20), return `{ reviews, count }`
    - `POST`: public, validate required fields + rating range + field lengths, create review with `approved: false`, return 201
  - Create `app/api/reviews/[id]/route.ts`:
    - `PATCH`: admin only via `protectAdmin`, update `approved` and/or `adminResponse`, return updated review; 401 if no session, 404 if not found
  - Create `app/api/reviews/admin/route.ts`:
    - `GET`: admin only via `protectAdmin`, return all reviews sorted `createdAt: -1`
  - All routes: `export const dynamic = 'force-dynamic'`, `connectDB()` before queries, `try/catch` returning `{ success, message }` on error
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ]* 4.1 Write property tests for Review API behaviour
    - **Property 13: New reviews are always created with approved: false**
    - **Property 14: Invalid POST requests return 400**
    - **Property 15: Public GET /api/reviews never returns unapproved reviews**
    - **Property 16: Public GET /api/reviews returns reviews sorted newest-first**
    - **Property 17: GET /api/reviews respects the limit parameter**
    - **Property 18: adminResponse is included in public API response when set**
    - **Property 19: PATCH approve/reject round-trip**
    - **Property 20: PATCH adminResponse persists the provided value**
    - **Property 21: PATCH without valid admin session returns 401**
    - **Property 22: PATCH to non-existent review returns 404**
    - **Validates: Requirements 9.1–9.5, 10.1–10.6, 11.1–11.5**

- [ ] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Create Product Detail Page server component
  - Create `app/(site)/products/[id]/page.tsx` as a server component
  - Implement `generateMetadata({ params })` returning `title` and `description` from the product document
  - Validate `params.id` with `isValidObjectId` (24-char hex regex); call `notFound()` if invalid
  - Call `connectDB()` then `Product.findById(id)`; call `notFound()` if null
  - Fetch related products: `Product.find({ categorySlug, _id: { $ne: id } }).limit(4)`
  - Render `<MediaGallery>`, `<ProductInfo>`, and a server-rendered related products grid (cards linking to `/products/[relatedId]`)
  - Omit the related products section entirely when the query returns 0 results
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 6.1 Write property tests for Product Detail Page routing
    - **Property 1: Invalid or missing product ID returns 404**
    - **Property 9: Related products never include the current product**
    - **Property 10: Related products count is at most 4**
    - **Validates: Requirements 1.3, 1.4, 5.1, 5.2, 5.3**

- [x] 7. Create MediaGallery client component
  - Create `app/(site)/products/[id]/MediaGallery.tsx` with `"use client"`
  - Props: `{ images: string[], videos: string[] }`; build `mediaItems: { type: 'image' | 'video', url: string }[]`
  - State: `selectedIndex: number` (default 0)
  - Main display: `<Image>` (next/image) for images, `<video controls>` for videos
  - Thumbnail strip: hidden when `mediaItems.length <= 1`; video thumbnails show a `Play` icon overlay (lucide-react)
  - Clicking a thumbnail sets `selectedIndex`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 6.3, 6.4_

  - [ ]* 7.1 Write property tests for MediaGallery
    - **Property 2: Media thumbnail count equals total media items**
    - **Property 3: Selected media index reflects thumbnail click**
    - **Property 4: Image URLs are passed through unmodified**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6, 6.3, 6.4**

- [x] 8. Create ProductInfo client component
  - Create `app/(site)/products/[id]/ProductInfo.tsx` with `"use client"`
  - Props: `{ product: { name, price, originalPrice?, description, sizes, colors? } }`
  - State: `selectedSize: string | null`, `selectedColor: string | null`
  - Format price as `₦${price.toLocaleString('en-NG')}`
  - Show strikethrough `originalPrice` and discount badge when `originalPrice > price`; discount = `Math.round((originalPrice - price) / originalPrice * 100)`
  - Size buttons: `bg-neutral-900 text-white` when selected, `border border-neutral-300` otherwise
  - Color swatches: `ring-2 ring-offset-2 ring-neutral-900` when selected
  - WhatsApp CTA href: `https://wa.me/393519420168?text=Hi%2C+I%27m+interested+in+${encodeURIComponent(name)}${selectedSize ? `+-+Size%3A+${encodeURIComponent(selectedSize)}` : ''}`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 4.3_

  - [ ]* 8.1 Write property tests for ProductInfo
    - **Property 5: Price formatting always includes ₦ symbol**
    - **Property 6: Discount percentage is correctly calculated**
    - **Property 7: Size and color selection is stored in state**
    - **Property 8: WhatsApp CTA URL encodes product name and selected size**
    - **Validates: Requirements 3.2, 3.3, 3.6, 3.7, 4.2, 4.3**

- [x] 9. Update product cards to link to detail page
  - Find all site-facing product card components (e.g. `src/components/ProductCard.tsx`, `src/components/ProductGallery.tsx`) that render product cards
  - Wrap each card (or its container) in a `<Link href={`/products/${product._id}`}>` using the product's MongoDB `_id`
  - Do not modify admin product card components
  - _Requirements: 1.1_

- [x] 10. Update Testimonials component
  - Replace hardcoded reviews in `src/components/Testimonials.tsx` with a `useEffect` fetch from `GET /api/reviews?limit=6`
  - Render approved reviews with star display, reviewer name, body text
  - When a review has a non-empty `adminResponse`, render it below the review body labeled "Response from the store" in a visually distinct style
  - Empty state: "Be the first to leave a review."
  - Add review submission form below the reviews grid: fields `reviewerName` (text), `rating` (1–5 star selector), `body` (textarea)
  - On submit: validate all fields client-side (show inline errors, no API call if invalid); POST to `/api/reviews`; disable submit button while in-flight
  - On success: show "Thank you! Your review has been submitted for approval." and reset all form fields
  - On network error: show "Something went wrong. Please try again."
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 13.1, 13.2, 13.3, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ]* 10.1 Write property tests for Testimonials component
    - **Property 23: Testimonials renders adminResponse when present**
    - **Property 24: Review form resets after successful submission**
    - **Property 25: Review form blocks submission with missing fields**
    - **Validates: Requirements 13.1, 13.2, 14.2, 14.3, 14.6**

- [x] 11. Create Admin Reviews page
  - Create `app/admin/reviews/page.tsx` as a client component (`"use client"`)
  - On mount, fetch `GET /api/reviews/admin`; redirect to `/admin/login` if 401
  - Display all reviews sorted newest-first; show a pending count badge at the top
  - Per-review card: reviewer name, star rating, body, submission date, status badge (Pending / Approved)
  - Approve/reject toggle button: sends `PATCH /api/reviews/[id]` with `{ approved: !current }`, updates state optimistically
  - `adminResponse` textarea + Save button per review: sends `PATCH /api/reviews/[id]` with `{ adminResponse }`, shows inline confirmation on success
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9_

- [x] 12. Add Reviews link to Admin sidebar
  - In `app/admin/layout.tsx`, import `MessageSquare` from `lucide-react`
  - Add `{ name: 'Reviews', href: '/admin/reviews', icon: MessageSquare }` to the `navItems` array
  - _Requirements: 12.1_

- [x] 13. Update social links and WhatsApp number
  - In `app/(site)/page.tsx`, update the WhatsApp href from `https://wa.me/2347068383089` to `https://wa.me/393519420168`
  - In `app/components/Footer.tsx` (or wherever social links live), add/update links:
    - WhatsApp: `https://wa.me/393519420168`
    - Instagram: `https://www.instagram.com/judy_haircollection` (open in new tab)
    - TikTok: `https://www.tiktok.com/@judy.hair.collect` (open in new tab)
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 14. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 15. Write property-based tests with fast-check
  - Create `__tests__/product-detail-reviews.property.test.ts`
  - Use fast-check with Jest; minimum 100 iterations per property
  - Tag each test: `// Feature: product-detail-and-reviews, Property N: <property_text>`
  - Cover all 25 properties defined in design.md using appropriate generators (arbitrary strings, number ranges, URL arrays, ObjectId-shaped strings, etc.)
  - _Requirements: all_

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties defined in design.md
- Unit tests validate specific examples and edge cases
