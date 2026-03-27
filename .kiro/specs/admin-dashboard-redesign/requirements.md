# Requirements Document

## Introduction

This feature redesigns the admin dashboard for the Judy Hair Collection Next.js e-commerce application. The existing sidebar navigation is preserved as-is. Everything else — the products page, product form, categories page, category form, and shared UI components — is rebuilt to match a card-based design spec. The redesign introduces a card-grid layout for products and categories, multi-image Cloudinary uploads, real-time URL-based search, category management with color/image support, and toast notifications via sonner.

## Glossary

- **Admin_Dashboard**: The protected admin area at `/admin/*`, accessible only to authenticated administrators
- **Products_Page**: The page at `/admin/products` that lists all products in a card grid
- **Product_Form**: The form pages at `/admin/products/new` and `/admin/products/[id]/edit` for creating and editing products
- **Categories_Page**: The page at `/admin/categories` that lists all categories in a card grid
- **Category_Form**: The form pages at `/admin/categories/new` and `/admin/categories/[id]/edit` for creating and editing categories
- **Product_Card**: A card UI component displaying a single product's image, name, price, category badge, featured toggle, and action buttons
- **Category_Card**: A card UI component displaying a single category's image, name, color dot, product count, slug, and action buttons
- **FeaturedToggle**: A star icon button that toggles a product's featured status with optimistic UI update
- **AdminProductSearch**: A search input component that updates URL query params and shows a progress bar during navigation
- **ProductGridSkeleton**: A loading placeholder showing 6 pulsing card skeletons
- **Category_Filter_Bar**: A sticky horizontal row of pill buttons for filtering products by category
- **Cloudinary**: The third-party image hosting service used for all product and category images
- **Sonner**: The toast notification library used for success and error feedback
- **Sidebar**: The existing fixed left-side navigation component in `app/admin/layout.tsx` — must not be modified
- **IProduct**: The existing Mongoose model interface in `app/models/Product.ts`

---

## Requirements

### Requirement 1: Admin Layout Content Area

**User Story:** As an admin, I want the main content area of the admin dashboard to have consistent spacing and a neutral background, so that all pages feel visually cohesive.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL render the existing Sidebar without any modifications to its markup, styles, or behavior
2. THE Admin_Dashboard SHALL apply a `bg-neutral-50` background to the main content area
3. THE Admin_Dashboard SHALL constrain page content to a maximum width of `max-w-6xl` with horizontal auto-centering
4. THE Admin_Dashboard SHALL apply consistent padding (`p-6` or `p-8`) to the main content wrapper

---

### Requirement 2: Products Page — Card Grid Layout

**User Story:** As an admin, I want to see all products displayed in a responsive card grid instead of a table, so that I can visually scan the catalog more efficiently.

#### Acceptance Criteria

1. THE Products_Page SHALL display products in a 3-column responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) using Product_Card components
2. THE Products_Page SHALL display a page header containing a title ("Products"), a subtitle ("Manage your product catalog"), an AdminProductSearch input, and an "Add Product" button that navigates to `/admin/products/new`
3. THE Products_Page SHALL display a sticky Category_Filter_Bar below the page header with an "All" pill and one pill per unique category derived from the fetched products
4. WHEN the active category filter pill is selected, THE Products_Page SHALL highlight it with a dark (`bg-neutral-900 text-white`) style and render all other pills with a neutral outline style
5. WHEN no products match the active filter and search query, THE Products_Page SHALL display an empty state with a dashed border, a package icon, and a message prompting the admin to add a product
6. WHEN the products API call fails, THE Products_Page SHALL display an error state with a red-tinted card and a retry button
7. WHILE products are loading, THE Products_Page SHALL display the ProductGridSkeleton component showing 6 pulsing placeholder cards

---

### Requirement 3: Products Page — Real-Time Search

**User Story:** As an admin, I want to search products by name in real time using the URL, so that search results are bookmarkable and shareable.

#### Acceptance Criteria

1. WHEN the admin types in the AdminProductSearch input, THE AdminProductSearch SHALL update the `search` URL query parameter using `router.push` with a debounce of 300ms
2. WHEN a `search` query parameter is present in the URL, THE Products_Page SHALL filter the displayed products client-side to those whose name contains the search string (case-insensitive)
3. WHEN the `search` query parameter changes, THE AdminProductSearch SHALL display a progress bar animation at the top of the input to indicate navigation is in progress
4. WHEN the search input is cleared, THE AdminProductSearch SHALL remove the `search` query parameter from the URL

---

### Requirement 4: Product Card Component

**User Story:** As an admin, I want each product card to show the product image, key details, and action buttons, so that I can manage products without opening a separate detail page.

#### Acceptance Criteria

1. THE Product_Card SHALL display the first product image using `next/image` with `fill` layout and `object-cover`, inside an `aspect-square` container with `rounded-t-xl` corners
2. WHEN the admin hovers over the product image, THE Product_Card SHALL scale the image to `scale-105` with a `transition-transform duration-300` animation
3. THE Product_Card SHALL display a category badge using `rounded-full` styling with a color derived from the category name (using a deterministic color mapping)
4. THE Product_Card SHALL display the product name (truncated to one line with `truncate`), price formatted as `₦{price.toLocaleString()}`, and original price struck through if present
5. THE Product_Card SHALL display a FeaturedToggle star button in the top-right corner of the card
6. THE Product_Card SHALL display an edit button (pencil icon) that navigates to `/admin/products/[id]/edit` and a delete button (trash icon) that opens a confirmation dialog
7. WHEN the delete button is clicked, THE Product_Card SHALL display a confirmation dialog before calling the delete API
8. WHEN the delete API call succeeds, THE Product_Card SHALL remove the card from the grid and display a success toast via Sonner
9. IF the delete API call fails, THEN THE Product_Card SHALL display an error toast via Sonner and keep the card in the grid

---

### Requirement 5: Featured Toggle Component

**User Story:** As an admin, I want to toggle a product's featured status with a single click and see the result immediately, so that I can manage featured products without page reloads.

#### Acceptance Criteria

1. THE FeaturedToggle SHALL display a filled amber star (`text-amber-500`) when the product is featured and an outline star (`text-neutral-300`) when it is not
2. WHEN the admin clicks the FeaturedToggle, THE FeaturedToggle SHALL immediately update the star icon state (optimistic update) before the API call completes
3. WHEN the toggle API call succeeds, THE FeaturedToggle SHALL display a success toast via Sonner ("Featured status updated")
4. IF the toggle API call fails, THEN THE FeaturedToggle SHALL revert the star icon to its previous state and display an error toast via Sonner

---

### Requirement 6: Product Grid Skeleton

**User Story:** As an admin, I want to see a loading skeleton while products are being fetched, so that the page feels responsive and avoids layout shift.

#### Acceptance Criteria

1. THE ProductGridSkeleton SHALL render exactly 6 skeleton cards in the same 3-column responsive grid as the product grid
2. Each skeleton card SHALL include a pulsing `animate-pulse` placeholder for the image area (`aspect-square`), category badge, product name, and price
3. THE ProductGridSkeleton SHALL use `bg-neutral-200` for all placeholder blocks

---

### Requirement 7: Product Form — Create and Edit

**User Story:** As an admin, I want a full-featured form to create and edit products, so that I can manage all product attributes in one place.

#### Acceptance Criteria

1. THE Product_Form SHALL be accessible at `/admin/products/new` for creation and `/admin/products/[id]/edit` for editing
2. WHEN the edit route is loaded, THE Product_Form SHALL pre-populate all fields with the existing product data fetched from the API
3. THE Product_Form SHALL include fields for: name (text, required), price (number, required), original price (number, optional), and description (textarea, required)
4. THE Product_Form SHALL include a category dropdown populated from the existing categories fetched via the categories API
5. THE Product_Form SHALL include a tags/subcategories input that allows the admin to add tags by typing and pressing Enter, and to remove tags by clicking an `×` button on each tag chip; quick-add buttons for common tags SHALL also be displayed
6. THE Product_Form SHALL include a features textarea where the admin enters one feature per line, which is split into an array on submission
7. THE Product_Form SHALL include a colors input (comma-separated string, split into array on submission) and a sizes input (comma-separated string, split into array on submission)
8. THE Product_Form SHALL include a featured checkbox
9. WHEN the Product_Form is submitted with missing required fields, THE Product_Form SHALL display inline validation error messages below each invalid field without submitting to the API
10. WHEN the Product_Form is submitted successfully for creation, THE Product_Form SHALL display a success toast and redirect to `/admin/products`
11. WHEN the Product_Form is submitted successfully for editing, THE Product_Form SHALL display a success toast and redirect to `/admin/products`
12. IF the API call fails during submission, THEN THE Product_Form SHALL display an error toast and remain on the form page

---

### Requirement 8: Multi-Image Upload to Cloudinary

**User Story:** As an admin, I want to upload multiple product images by dragging and dropping or clicking, so that I can add rich visual content to products efficiently.

#### Acceptance Criteria

1. THE Product_Form SHALL include an image upload area that accepts drag-and-drop and click-to-select file input for JPG, PNG, and WebP files
2. WHEN images are selected, THE Product_Form SHALL display thumbnail previews with a remove (`×`) button for each image
3. WHEN an image is removed from the preview, THE Product_Form SHALL remove it from the pending upload list
4. WHEN the form is submitted, THE Product_Form SHALL upload all selected images to Cloudinary via the `/api/upload/multiple` endpoint and use the returned URLs as the product's `images` array
5. IF an image file exceeds 10MB, THEN THE Product_Form SHALL display an inline error ("Image must be under 10MB") and exclude that file from the upload
6. IF an image file is not JPG, PNG, or WebP, THEN THE Product_Form SHALL display an inline error ("Only JPG, PNG, WebP allowed") and exclude that file
7. WHILE images are uploading, THE Product_Form SHALL display a loading indicator on the submit button and disable the button to prevent duplicate submissions

---

### Requirement 9: Categories Page — Card Grid Layout

**User Story:** As an admin, I want to see all categories displayed in a card grid with their image, name, color, and product count, so that I can manage the category catalog visually.

#### Acceptance Criteria

1. THE Categories_Page SHALL be accessible at `/admin/categories`
2. THE Categories_Page SHALL display categories in a responsive card grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) using Category_Card components
3. THE Categories_Page SHALL display a page header with a title ("Categories"), a subtitle, and an "Add Category" button that navigates to `/admin/categories/new`
4. WHILE categories are loading, THE Categories_Page SHALL display a skeleton loading state
5. WHEN no categories exist, THE Categories_Page SHALL display an empty state with a message and a link to add the first category

---

### Requirement 10: Category Card Component

**User Story:** As an admin, I want each category card to show the category image, name, color indicator, product count, and slug, so that I can identify and manage categories at a glance.

#### Acceptance Criteria

1. THE Category_Card SHALL display the category image using `next/image` with `fill` layout and `object-cover` inside an `aspect-video` container, falling back to a neutral placeholder if no image is set
2. THE Category_Card SHALL display a color dot using the category's stored color value
3. THE Category_Card SHALL display the category name, slug (prefixed with `/`), and product count (e.g., "12 products")
4. THE Category_Card SHALL display a "View Products" button that navigates to `/admin/products?category={slug}`, an edit button that navigates to `/admin/categories/[id]/edit`, and a delete button that opens a confirmation dialog
5. WHEN the delete button is clicked, THE Category_Card SHALL display a confirmation dialog before calling the delete API
6. WHEN the delete API call succeeds, THE Category_Card SHALL remove the card from the grid and display a success toast via Sonner
7. IF the delete API call fails, THEN THE Category_Card SHALL display an error toast via Sonner and keep the card in the grid

---

### Requirement 11: Category Form — Create and Edit

**User Story:** As an admin, I want a form to create and edit categories with a name, slug, description, color, and image, so that I can maintain a well-organized product catalog.

#### Acceptance Criteria

1. THE Category_Form SHALL be accessible at `/admin/categories/new` for creation and `/admin/categories/[id]/edit` for editing
2. WHEN the edit route is loaded, THE Category_Form SHALL pre-populate all fields with the existing category data
3. THE Category_Form SHALL include fields for: name (text, required), slug (text, required, auto-generated from name), description (textarea, optional), and color (color picker, required)
4. WHEN the admin types in the name field, THE Category_Form SHALL automatically generate a URL-safe slug by converting the name to lowercase and replacing spaces and special characters with hyphens, unless the admin has manually edited the slug field
5. THE Category_Form SHALL include an image upload field that uploads to Cloudinary via the `/api/upload/single` endpoint
6. WHEN in edit mode, THE Category_Form SHALL display a "Quick-select from product images" section showing thumbnail images from products in that category, allowing the admin to select one as the category image without re-uploading
7. WHEN the Category_Form is submitted with a missing required field, THE Category_Form SHALL display inline validation errors without submitting to the API
8. WHEN the Category_Form is submitted successfully, THE Category_Form SHALL display a success toast and redirect to `/admin/categories`
9. IF the API call fails during submission, THEN THE Category_Form SHALL display an error toast and remain on the form page

---

### Requirement 12: Category Data Model and API

**User Story:** As a developer, I want a Category Mongoose model and corresponding API routes, so that categories can be stored, retrieved, updated, and deleted independently of products.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL have a `Category` Mongoose model with fields: `name` (String, required), `slug` (String, required, unique, lowercase), `description` (String, optional), `color` (String, required, hex or Tailwind color), `image` (String, optional URL), and timestamps
2. THE Admin_Dashboard SHALL expose a `GET /api/categories` route that returns all categories sorted by name
3. THE Admin_Dashboard SHALL expose a `POST /api/categories` route (admin-protected) that creates a new category
4. THE Admin_Dashboard SHALL expose a `GET /api/categories/[id]` route that returns a single category by ID
5. THE Admin_Dashboard SHALL expose a `PUT /api/categories/[id]` route (admin-protected) that updates a category
6. THE Admin_Dashboard SHALL expose a `DELETE /api/categories/[id]` route (admin-protected) that deletes a category
7. WHEN a category is deleted, THE Admin_Dashboard SHALL NOT delete the products in that category; products SHALL retain their `category` and `categorySlug` fields

---

### Requirement 13: Design System Consistency

**User Story:** As an admin, I want all admin pages to follow a consistent design system, so that the interface feels professional and predictable.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL use `rounded-xl`, `border-neutral-200`, and `shadow-sm` on all card components, transitioning to `hover:shadow-lg` on hover
2. THE Admin_Dashboard SHALL use `rounded-lg` and `transition-colors` on all button components
3. THE Admin_Dashboard SHALL use `rounded-full` for all badge and pill components
4. THE Admin_Dashboard SHALL use `text-2xl font-bold` for all page titles and `text-sm` for body text
5. THE Admin_Dashboard SHALL use `bg-neutral-900` for primary action buttons with `text-white`, and `hover:bg-neutral-800` on hover
6. THE Admin_Dashboard SHALL use `amber-500` / `amber-600` / `amber-700` for accent elements (featured star, active states, highlights)
7. THE Admin_Dashboard SHALL use red (`red-600`, `red-50`) for destructive actions (delete buttons, error states)
