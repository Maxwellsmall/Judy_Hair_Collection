# Design Document: Product Detail & Reviews

## Overview

This feature adds two closely related capabilities to the Judy Hair Collection Next.js 15 App Router site:

1. **Product Detail Page** (`/products/[id]`) — a server-rendered page with a media gallery (images + videos), product info with size/color selectors, a WhatsApp CTA, and a related products section.
2. **Dynamic Review System** — replaces hardcoded testimonials with a MongoDB-backed review system. Customers submit reviews on the homepage; admins approve/reject/respond from `/admin/reviews`.

Both features build on the existing stack: Next.js 15 App Router, TypeScript, Tailwind CSS, MongoDB via Mongoose, Cloudinary for media, and JWT-cookie admin auth via `protectAdmin`.

---

## Architecture

```mermaid
graph TD
  subgraph Site
    PC[Product Card] -->|link to /products/[id]| PDP[Product Detail Page\nserver component]
    PDP --> MG[MediaGallery\nclient component]
    PDP --> PI[ProductInfo\nclient component]
    PDP --> RP[Related Products\nserver-rendered grid]
    HP[Homepage] --> TS[Testimonials\nclient component]
  end

  subgraph Admin
    AL[Admin Layout\n/admin/reviews nav] --> ARP[Admin Reviews Page\nclient component]
    ARP -->|PATCH| RAPI
  end

  subgraph API
    RAPI[/api/reviews\nGET public + POST public]
    RAID[/api/reviews/[id]\nPATCH admin]
    RAADM[/api/reviews/admin\nGET admin]
  end

  subgraph Data
    RM[Review Model\nMongoDB]
    PM[Product Model\n+ videos field]
  end

  TS -->|GET /api/reviews| RAPI
  TS -->|POST /api/reviews| RAPI
  ARP -->|GET /api/reviews/admin| RAADM
  RAPI --> RM
  RAID --> RM
  RAADM --> RM
  PDP --> PM
```

All API routes follow the existing pattern: `export const dynamic = 'force-dynamic'`, `connectDB()` before queries, `protectAdmin(cookieStore)` for admin-only routes, consistent `{ success, data/message }` JSON shape.

---

## Components and Interfaces

### Product Detail Page — `app/(site)/products/[id]/page.tsx`

Server component. Responsibilities:
- `generateMetadata({ params })` — sets `title` and `description` from the product document for SEO.
- Validates `params.id` is a 24-char hex string; calls `notFound()` immediately if not.
- Calls `connectDB()` then `Product.findById(id)`; calls `notFound()` if null.
- Fetches related products: `Product.find({ categorySlug, _id: { $ne: id } }).limit(4)`.
- Renders `<MediaGallery>`, `<ProductInfo>`, and the related products grid (server-rendered product cards with links to `/products/[relatedId]`).

```typescript
// ObjectId validation guard (used in page.tsx and API routes)
function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}
```

### MediaGallery — `app/(site)/products/[id]/MediaGallery.tsx`

Client component (`"use client"`).

```typescript
type MediaItem = { type: 'image' | 'video'; url: string };

interface MediaGalleryProps {
  images: string[];
  videos: string[];
}
```

State: `selectedIndex: number` (default 0).

Behavior:
- Builds `mediaItems: MediaItem[]` by mapping `images` → `{ type: 'image', url }` then `videos` → `{ type: 'video', url }`.
- Main display: `<Image>` (next/image) when `type === 'image'`; `<video controls>` when `type === 'video'`.
- Thumbnail strip: hidden when `mediaItems.length <= 1`.
- Video thumbnails show a play icon overlay (absolute-positioned SVG/lucide `Play` icon).
- Clicking a thumbnail sets `selectedIndex`.

### ProductInfo — `app/(site)/products/[id]/ProductInfo.tsx`

Client component (`"use client"`).

```typescript
interface ProductInfoProps {
  product: {
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    sizes: string[];
    colors?: string[];
  };
}
```

State: `selectedSize: string | null`, `selectedColor: string | null`.

Behavior:
- Price formatted as `₦${price.toLocaleString('en-NG')}`.
- Discount: shown when `originalPrice > price`; `Math.round((originalPrice - price) / originalPrice * 100)`.
- Size buttons: `bg-neutral-900 text-white` when selected, `border border-neutral-300` otherwise.
- Color swatches: `ring-2 ring-offset-2 ring-neutral-900` when selected.
- WhatsApp CTA href: `https://wa.me/393519420168?text=Hi%2C+I%27m+interested+in+${encodeURIComponent(name)}${selectedSize ? `+-+Size%3A+${encodeURIComponent(selectedSize)}` : ''}`.

### Review Model — `app/models/Review.ts`

```typescript
interface IReview extends Document {
  reviewerName: string;   // required, max 100
  rating: number;         // required, integer 1–5
  body: string;           // required, max 500
  approved: boolean;      // default false
  adminResponse?: string; // optional, max 1000
  createdAt: Date;
  updatedAt: Date;
}
```

### Testimonials — `src/components/Testimonials.tsx` (updated)

Client component. On mount, fetches `GET /api/reviews?limit=6`. Renders approved reviews with star display, reviewer name, body, and `adminResponse` (when present, labeled "Response from the store" in a visually distinct style). Includes a submission form below the reviews grid.

Form state: `{ reviewerName: string, rating: number | null, body: string }` + `submitting: boolean` + `submitStatus: 'idle' | 'success' | 'error'`.

### Admin Reviews Page — `app/admin/reviews/page.tsx`

Client component. Fetches `GET /api/reviews/admin` on mount. Displays all reviews (pending + approved) sorted newest-first. Per-review card shows: name, stars, body, date, status badge, approve/reject toggle, and an expandable `adminResponse` textarea with a Save button. Uses optimistic UI for approve/reject toggles.

---

## Data Models

### Review Schema

```typescript
const reviewSchema = new Schema<IReview>(
  {
    reviewerName: { type: String, required: true, trim: true, maxlength: 100 },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5',
      },
    },
    body: { type: String, required: true, trim: true, maxlength: 500 },
    approved: { type: Boolean, default: false },
    adminResponse: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

reviewSchema.index({ approved: 1, createdAt: -1 });
```

### Product Schema Update

Add to `app/models/Product.ts`:

```typescript
videos: {
  type: [String],
  default: [],
  validate: {
    validator: (v: string[]) => v.length <= 5,
    message: 'Product cannot have more than 5 videos',
  },
},
```

Also add `videos?: string[]` to the `IProduct` interface.

### Upload API Update

`app/api/upload/single/route.ts` — accept an optional `type` form field (`'image'` | `'video'`). When `type === 'video'`, use `resource_type: 'video'` and folder `judy-hair/products/videos`. Default remains `resource_type: 'image'`.

---

## API Design

### `GET /api/reviews`

Public. Query: `?limit=N` (default 6, max 20).

```
Response 200:
{ reviews: IReview[], count: number }
// Only approved: true, sorted createdAt desc, includes adminResponse when set
```

### `POST /api/reviews`

Public. Body: `{ reviewerName, rating, body }`.

Validation (before DB call):
- All three fields required → 400 if missing.
- `rating` must be integer 1–5 → 400 if not.
- `body` max 500 chars, `reviewerName` max 100 chars → 400 if exceeded.

```
Response 201: { success: true, data: { review } }  // approved: false
Response 400: { success: false, message: string }
```

### `PATCH /api/reviews/[id]`

Admin only (`protectAdmin`). Body: `{ approved?: boolean, adminResponse?: string }`.

```
Response 200: { success: true, data: { review } }
Response 401: { success: false, message: 'Unauthorized' }
Response 404: { success: false, message: 'Review not found' }
```

### `GET /api/reviews/admin`

Admin only (`protectAdmin`). Returns all reviews sorted `createdAt: -1`.

```
Response 200: { success: true, data: { reviews, count } }
Response 401: { success: false, message: 'Unauthorized' }
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Invalid or missing product ID returns 404

*For any* string passed as the `[id]` route parameter that is either not a valid 24-character hex ObjectId or does not correspond to an existing product document, the Product Detail Page SHALL return a 404 response.

**Validates: Requirements 1.3, 1.4**

---

### Property 2: Media thumbnail count equals total media items

*For any* product with `N` images and `M` videos, the MediaGallery component SHALL render exactly `N + M` thumbnail elements (or zero thumbnails when `N + M === 1`).

**Validates: Requirements 2.3, 2.4, 6.3, 6.4**

---

### Property 3: Selected media index reflects thumbnail click

*For any* media item at index `i` in the combined `mediaItems` array, clicking its thumbnail SHALL set `selectedIndex` to `i`, causing the main display to render that item.

**Validates: Requirements 2.2, 2.6**

---

### Property 4: Image URLs are passed through unmodified

*For any* Cloudinary URL stored in a product's `images` array, the `src` attribute of the rendered `<Image>` element SHALL equal that URL exactly.

**Validates: Requirements 2.5**

---

### Property 5: Price formatting always includes ₦ symbol

*For any* numeric price value, the formatted price string SHALL begin with `₦` and the numeric portion SHALL match `price.toLocaleString('en-NG')`.

**Validates: Requirements 3.2**

---

### Property 6: Discount percentage is correctly calculated

*For any* product where `originalPrice > price`, the displayed discount percentage SHALL equal `Math.round((originalPrice - price) / originalPrice * 100)`.

**Validates: Requirements 3.3**

---

### Property 7: Size and color selection is stored in state

*For any* size or color value present in the product's `sizes` or `colors` arrays, clicking it SHALL update the corresponding state variable (`selectedSize` or `selectedColor`) to that value.

**Validates: Requirements 3.6, 3.7**

---

### Property 8: WhatsApp CTA URL encodes product name and selected size

*For any* product name and any selected size (or null), the generated WhatsApp href SHALL contain `wa.me/393519420168` and the URL-encoded product name, and SHALL include the URL-encoded size only when a size is selected.

**Validates: Requirements 4.2, 4.3**

---

### Property 9: Related products never include the current product

*For any* product page, the related products query result SHALL not contain a document whose `_id` equals the current product's `_id`.

**Validates: Requirements 5.2**

---

### Property 10: Related products count is at most 4

*For any* product, the related products section SHALL display at most 4 products.

**Validates: Requirements 5.1, 5.3**

---

### Property 11: Videos array validation rejects more than 5 entries

*For any* array of video URLs with length greater than 5, the Product model's Mongoose validator SHALL reject the document with a validation error.

**Validates: Requirements 6.2**

---

### Property 12: Review model rejects invalid field values

*For any* review document where `rating` is not an integer in [1, 5], or `body` exceeds 500 characters or is empty, or `reviewerName` exceeds 100 characters or is empty, the Mongoose validator SHALL reject the document with a validation error.

**Validates: Requirements 8.3, 8.4, 8.5**

---

### Property 13: New reviews are always created with approved: false

*For any* valid POST request to `/api/reviews`, the created review document SHALL have `approved: false` regardless of any `approved` field in the request body, and the response status SHALL be 201.

**Validates: Requirements 9.1, 9.5**

---

### Property 14: Invalid POST requests return 400

*For any* POST request to `/api/reviews` with a missing required field, a non-integer rating, a rating outside [1, 5], or a body exceeding 500 characters, the API SHALL return a 400 status with a descriptive error message.

**Validates: Requirements 9.2, 9.3, 9.4**

---

### Property 15: Public GET /api/reviews never returns unapproved reviews

*For any* database state containing a mix of approved and unapproved reviews, `GET /api/reviews` SHALL return only documents where `approved === true`.

**Validates: Requirements 10.1, 7.1**

---

### Property 16: Public GET /api/reviews returns reviews sorted newest-first

*For any* set of approved reviews with distinct `createdAt` timestamps, the returned `reviews` array SHALL be sorted in descending `createdAt` order.

**Validates: Requirements 10.2**

---

### Property 17: GET /api/reviews respects the limit parameter

*For any* integer `N` in [1, 20], `GET /api/reviews?limit=N` SHALL return at most `N` reviews. When `limit` is omitted, at most 6 reviews SHALL be returned.

**Validates: Requirements 10.3, 7.4**

---

### Property 18: adminResponse is included in public API response when set

*For any* approved review with a non-empty `adminResponse`, the object returned by `GET /api/reviews` SHALL include the `adminResponse` field with its stored value.

**Validates: Requirements 10.6, 13.1**

---

### Property 19: PATCH approve/reject round-trip

*For any* review, patching with `{ approved: true }` followed by `{ approved: false }` SHALL result in the review having `approved === false`. The inverse sequence SHALL result in `approved === true`.

**Validates: Requirements 11.1, 11.2**

---

### Property 20: PATCH adminResponse persists the provided value

*For any* review and any string `s` (within 1000 chars), patching with `{ adminResponse: s }` SHALL result in the review's `adminResponse` field equaling `s`.

**Validates: Requirements 11.3**

---

### Property 21: PATCH without valid admin session returns 401

*For any* PATCH request to `/api/reviews/[id]` made without a valid `admin_session` cookie, the API SHALL return a 401 status.

**Validates: Requirements 11.4**

---

### Property 22: PATCH to non-existent review returns 404

*For any* valid ObjectId that does not correspond to an existing review document, `PATCH /api/reviews/[id]` SHALL return a 404 status.

**Validates: Requirements 11.5**

---

### Property 23: Testimonials renders adminResponse when present

*For any* approved review with a non-empty `adminResponse`, the Testimonials component SHALL render that text visually associated with the review, labeled "Response from the store".

**Validates: Requirements 13.1, 13.2**

---

### Property 24: Review form resets after successful submission

*For any* successful POST to `/api/reviews`, the Testimonials submission form SHALL reset all fields to their default empty/null state and display the success message.

**Validates: Requirements 14.2, 14.6**

---

### Property 25: Review form blocks submission with missing fields

*For any* form submission attempt where `reviewerName`, `rating`, or `body` is missing or empty, the Testimonials component SHALL display inline validation errors and SHALL NOT make a POST request to `/api/reviews`.

**Validates: Requirements 14.3**

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Invalid ObjectId in `/products/[id]` | `notFound()` → 404 page |
| Product not found in DB | `notFound()` → 404 page |
| DB connection failure in page | Next.js error boundary → 500 |
| POST `/api/reviews` validation failure | 400 + descriptive message |
| PATCH without admin session | 401 |
| PATCH to missing review ID | 404 |
| DB error in any API route | 500 + `{ success: false, message }` |
| Testimonials fetch failure | Show existing reviews or empty state; no crash |
| Review submission network error | Display "Something went wrong. Please try again." |
| Video upload failure | Return 500 from upload API; admin sees error toast |

All API routes follow the existing pattern of wrapping handlers in `try/catch` and returning structured `{ success: false, message }` JSON on error.

---

## Testing Strategy

### Unit Tests

Focus on pure functions and isolated logic:

- `isValidObjectId(id)` — valid 24-char hex strings pass, all others fail.
- Price formatter — `₦` prefix, locale-formatted number.
- Discount percentage calculator — correct rounding, only shown when `originalPrice > price`.
- WhatsApp URL builder — correct encoding with and without selected size.
- Review model validation — rejects invalid ratings, oversized fields, empty required fields.
- Product model `videos` validation — rejects arrays longer than 5.

### Property-Based Tests

Use **fast-check** (already compatible with Jest/Vitest in the existing stack).

Each property test runs a minimum of **100 iterations**.

Tag format: `// Feature: product-detail-and-reviews, Property N: <property_text>`

| Property | Test Description | Generator Inputs |
|---|---|---|
| P1 | Invalid/missing product ID → 404 | Arbitrary strings that fail 24-char hex regex |
| P2 | Thumbnail count = images + videos | Random image/video URL arrays |
| P3 | Thumbnail click sets selectedIndex | Random index within mediaItems |
| P4 | Image URLs unmodified | Arbitrary URL strings |
| P5 | Price formatting includes ₦ | Arbitrary positive numbers |
| P6 | Discount % calculation | Pairs where originalPrice > price |
| P7 | Size/color selection stored in state | Random size/color arrays, random selection |
| P8 | WhatsApp URL encodes name + size | Arbitrary product names, nullable sizes |
| P9 | Related products exclude current ID | Random product sets with shared categorySlug |
| P10 | Related products ≤ 4 | Random product sets |
| P11 | Videos array > 5 rejected | Arrays of length 6–20 |
| P12 | Review model rejects invalid fields | Out-of-range ratings, oversized strings |
| P13 | New reviews have approved: false | Valid review payloads |
| P14 | Invalid POST → 400 | Missing fields, bad ratings, oversized body |
| P15 | Public GET never returns unapproved | Mixed approved/unapproved DB states |
| P16 | Public GET sorted newest-first | Random sets of approved reviews |
| P17 | GET respects limit param | Random N in [1, 20] |
| P18 | adminResponse in public response | Approved reviews with adminResponse set |
| P19 | Approve/reject round-trip | Any review document |
| P20 | PATCH adminResponse persists | Arbitrary strings ≤ 1000 chars |
| P21 | No session → 401 | Requests without admin_session cookie |
| P22 | Non-existent ID → 404 | Valid ObjectIds not in DB |
| P23 | Testimonials renders adminResponse | Reviews with/without adminResponse |
| P24 | Form resets after success | Valid form submissions |
| P25 | Form blocks empty submission | Incomplete form states |

### Integration Tests

- Full request/response cycle for `GET /api/reviews`, `POST /api/reviews`, `PATCH /api/reviews/[id]`, `GET /api/reviews/admin` using an in-memory MongoDB instance (e.g., `mongodb-memory-server`).
- Product Detail Page: verify `generateMetadata` returns correct title/description, verify 404 for invalid IDs.
- Admin Reviews Page: verify redirect to `/admin/login` when session cookie is absent.
