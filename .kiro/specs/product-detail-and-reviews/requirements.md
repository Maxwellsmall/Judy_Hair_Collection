# Requirements Document

## Introduction

This feature covers two closely related enhancements to the Judy Hair Collection e-commerce platform:

1. **Product Detail Page** — Each product card currently has no navigation target. This adds a dedicated `/products/[id]` page with a media gallery (images and short video clips), product info, size/color selectors, a "Contact to Purchase" CTA, and a related products section.

2. **Dynamic Review System** — The homepage currently shows three hardcoded fake testimonials. This replaces them with a real review system backed by MongoDB, where customers can submit reviews, approved reviews are displayed on the homepage, and the admin can manage reviews (approve/reject/respond) from a dedicated admin page.

Both features are built on the existing Next.js 15 App Router, MongoDB (via Mongoose), and Cloudinary stack. The store sells all kinds of products (fashion, creams, home goods, etc.) so the category system must remain flexible and not tied to any specific product type.

---

## Glossary

- **Product_Detail_Page**: The server-rendered page at `/products/[id]` that displays full information for a single product.
- **Review**: A customer-submitted testimonial containing a rating (1–5 stars), a text body, and the reviewer's name.
- **Review_API**: The Next.js API route set at `/api/reviews` responsible for creating, retrieving, and managing reviews.
- **Review_Model**: The Mongoose model that persists review documents in MongoDB.
- **Testimonials_Section**: The section on the homepage that displays approved customer reviews.
- **Related_Products**: Up to 4 products sharing the same `categorySlug` as the currently viewed product, excluding the product itself.
- **Media_Gallery**: The interactive component on the Product Detail Page showing a large main media item (image or video) and clickable thumbnails.
- **Contact_CTA**: The "Contact to Purchase" button that opens a WhatsApp chat with a pre-filled message about the product.
- **Admin**: An authenticated administrator who can approve, reject, and respond to submitted reviews.
- **Admin_Review_Page**: The dedicated page in the admin panel at `/admin/reviews` for managing all submitted reviews.
- **Admin_Response**: An optional text reply written by the Admin to a specific review, visible to customers alongside the review.

---

## Requirements

### Requirement 1: Product Detail Page Navigation

**User Story:** As a customer, I want to click on a product card and be taken to a dedicated product page, so that I can view full product details before deciding to purchase.

#### Acceptance Criteria

1. WHEN a customer clicks a product card anywhere on the site, THE Product_Detail_Page SHALL open at the URL `/products/[id]` where `[id]` is the MongoDB ObjectId of the product.
2. THE Product_Detail_Page SHALL be server-side rendered using Next.js App Router with `generateMetadata` for SEO.
3. IF the product `[id]` does not exist in MongoDB, THEN THE Product_Detail_Page SHALL return a 404 response and render the site's not-found page.
4. IF the product `[id]` is not a valid MongoDB ObjectId format, THEN THE Product_Detail_Page SHALL return a 404 response.

---

### Requirement 2: Product Detail Page — Media Gallery

**User Story:** As a customer, I want to see high-resolution product images and short video clips with thumbnail navigation, so that I can inspect the product from multiple angles before purchasing.

#### Acceptance Criteria

1. THE Media_Gallery SHALL display the first product image as the default main media item on page load.
2. WHEN a customer clicks a thumbnail, THE Media_Gallery SHALL update the main display area to show the selected image or play the selected video.
3. THE Media_Gallery SHALL render all items from the product's `images` array and `videos` array as clickable thumbnails.
4. WHERE a product has only one media item, THE Media_Gallery SHALL display that item without rendering a thumbnail strip.
5. THE Media_Gallery SHALL display images using the Cloudinary URLs stored in the product document without modification.
6. WHEN a video thumbnail is selected, THE Media_Gallery SHALL render the video using an HTML `<video>` element with playback controls.
7. THE Media_Gallery SHALL visually distinguish video thumbnails from image thumbnails (e.g., with a play icon overlay).

---

### Requirement 3: Product Detail Page — Product Information

**User Story:** As a customer, I want to see the product name, price, description, and available sizes/colors, so that I can make an informed purchase decision.

#### Acceptance Criteria

1. THE Product_Detail_Page SHALL display the product's `name`, `price`, `description`, `sizes`, and `colors` fields from the MongoDB document.
2. THE Product_Detail_Page SHALL format the price in Nigerian Naira using the `₦` symbol with locale-formatted numbers (e.g., ₦45,000).
3. WHERE a product has an `originalPrice` greater than `price`, THE Product_Detail_Page SHALL display the original price with a strikethrough and calculate the discount percentage.
4. THE Product_Detail_Page SHALL display all available sizes as selectable options.
5. WHERE a product has a non-empty `colors` array, THE Product_Detail_Page SHALL display color options as selectable swatches or labels.
6. WHEN a customer selects a size, THE Product_Detail_Page SHALL visually highlight the selected size and store the selection in component state.
7. WHEN a customer selects a color, THE Product_Detail_Page SHALL visually highlight the selected color and store the selection in component state.

---

### Requirement 4: Product Detail Page — Contact to Purchase CTA

**User Story:** As a customer, I want a clear call-to-action to contact the seller about a product, so that I can initiate a purchase conversation.

#### Acceptance Criteria

1. THE Contact_CTA SHALL be a button labeled "Contact to Purchase" that opens a WhatsApp chat link in a new browser tab.
2. THE Contact_CTA SHALL pre-fill the WhatsApp message with the product name and selected size (if chosen), using the WhatsApp number `+393519420168`.
3. WHEN no size has been selected and the product has multiple sizes, THE Contact_CTA SHALL pre-fill the WhatsApp message with the product name only, without a size reference.
4. THE Contact_CTA SHALL use the same WhatsApp link generation pattern as the existing `generateWhatsAppLink` utility in `src/lib/whatsapp.ts`.

---

### Requirement 5: Product Detail Page — Related Products

**User Story:** As a customer, I want to see related products on the product detail page, so that I can discover other items I might be interested in.

#### Acceptance Criteria

1. THE Product_Detail_Page SHALL display a "Related Products" section showing up to 4 products that share the same `categorySlug` as the current product.
2. THE Related_Products section SHALL exclude the currently viewed product from its results.
3. WHEN fewer than 4 products share the same `categorySlug` (excluding the current product), THE Product_Detail_Page SHALL display only the available related products.
4. WHEN no products share the same `categorySlug`, THE Product_Detail_Page SHALL not render the Related_Products section.
5. WHEN a customer clicks a related product card, THE Product_Detail_Page SHALL navigate to that product's detail page at `/products/[id]`.

---

### Requirement 6: Product Model — Video Support

**User Story:** As an admin, I want to upload short video clips alongside product images, so that customers can see the product in motion on the product detail page.

#### Acceptance Criteria

1. THE Product_Model SHALL include a `videos` field as an array of strings storing Cloudinary video URLs, with a default of an empty array.
2. THE Product_Model SHALL validate that the `videos` array does not exceed 5 entries.
3. THE Product_Detail_Page SHALL display all video URLs from the product's `videos` array in the Media_Gallery alongside images.
4. WHERE a product has no videos, THE Media_Gallery SHALL display only images without rendering any video thumbnails.
5. THE admin product edit page SHALL allow uploading video files to Cloudinary and storing the resulting URLs in the product's `videos` field.

---

### Requirement 7: Remove Static Reviews

**User Story:** As a business owner, I want the fake hardcoded reviews removed from the homepage, so that only genuine customer reviews are displayed.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL not contain any hardcoded review data.
2. THE Testimonials_Section SHALL fetch and display reviews from the Review_API at `/api/reviews`.
3. WHEN no approved reviews exist in the database, THE Testimonials_Section SHALL display a placeholder message such as "Be the first to leave a review."
4. THE Testimonials_Section SHALL display a maximum of 6 reviews on the homepage.

---

### Requirement 8: Review Data Model

**User Story:** As a developer, I want a well-defined MongoDB schema for reviews, so that review data is stored consistently and can be queried reliably.

#### Acceptance Criteria

1. THE Review_Model SHALL store the following fields: `reviewerName` (string, required), `rating` (integer 1–5, required), `body` (string, required, max 500 characters), `approved` (boolean, default `false`), `createdAt` (timestamp, auto-generated).
2. THE Review_Model SHALL include an optional `adminResponse` field (string, max 1000 characters) to store the Admin's reply to a review.
3. THE Review_Model SHALL validate that `rating` is an integer between 1 and 5 inclusive.
4. THE Review_Model SHALL validate that `body` is not empty and does not exceed 500 characters.
5. THE Review_Model SHALL validate that `reviewerName` is not empty and does not exceed 100 characters.
6. THE Review_Model SHALL index the `approved` and `createdAt` fields for efficient homepage queries.

---

### Requirement 9: Review Submission API

**User Story:** As a customer, I want to submit a review for a product I purchased, so that I can share my experience with other shoppers.

#### Acceptance Criteria

1. WHEN a POST request is made to `/api/reviews` with valid `reviewerName`, `rating`, and `body` fields, THE Review_API SHALL create a new review document in MongoDB with `approved` set to `false`.
2. WHEN a POST request is made to `/api/reviews` with missing required fields, THE Review_API SHALL return a 400 status with a descriptive error message.
3. WHEN a POST request is made to `/api/reviews` with a `rating` outside the range 1–5, THE Review_API SHALL return a 400 status with a descriptive error message.
4. WHEN a POST request is made to `/api/reviews` with a `body` exceeding 500 characters, THE Review_API SHALL return a 400 status with a descriptive error message.
5. THE Review_API SHALL return a 201 status and the created review document on successful submission.

---

### Requirement 10: Review Retrieval API

**User Story:** As a developer, I want an API endpoint to fetch approved reviews, so that the homepage can display real customer testimonials.

#### Acceptance Criteria

1. WHEN a GET request is made to `/api/reviews`, THE Review_API SHALL return only reviews where `approved` is `true`.
2. THE Review_API SHALL return reviews sorted by `createdAt` descending (newest first).
3. THE Review_API SHALL accept an optional `limit` query parameter (default 6, maximum 20) to control the number of reviews returned.
4. THE Review_API SHALL return a 200 status with a JSON body containing a `reviews` array and a `count` field.
5. IF a database error occurs during retrieval, THEN THE Review_API SHALL return a 500 status with an error message.
6. WHEN a review has a non-empty `adminResponse` field, THE Review_API SHALL include the `adminResponse` value in the returned review object.

---

### Requirement 11: Review Approval API (Admin)

**User Story:** As an admin, I want to approve or reject submitted reviews via API, so that only genuine and appropriate reviews appear on the homepage.

#### Acceptance Criteria

1. WHEN an authenticated admin makes a PATCH request to `/api/reviews/[id]` with `{ "approved": true }`, THE Review_API SHALL update the review's `approved` field to `true`.
2. WHEN an authenticated admin makes a PATCH request to `/api/reviews/[id]` with `{ "approved": false }`, THE Review_API SHALL update the review's `approved` field to `false`.
3. WHEN an authenticated admin makes a PATCH request to `/api/reviews/[id]` with an `adminResponse` string, THE Review_API SHALL update the review's `adminResponse` field with the provided string.
4. IF a PATCH request to `/api/reviews/[id]` is made without a valid admin session cookie, THEN THE Review_API SHALL return a 401 status.
5. IF a PATCH request is made to `/api/reviews/[id]` where `[id]` does not exist, THEN THE Review_API SHALL return a 404 status.
6. THE Review_API SHALL reuse the existing `protectAdmin` middleware from `app/middleware/auth.ts` for authentication.

---

### Requirement 12: Admin Review Management Page

**User Story:** As an admin, I want a dedicated review management page in the admin panel, so that I can see all submitted reviews, approve or reject them, and write responses that are visible to customers.

#### Acceptance Criteria

1. THE Admin_Review_Page SHALL be accessible at `/admin/reviews` and linked from the admin sidebar navigation.
2. THE Admin_Review_Page SHALL display all reviews from the database, both pending (unapproved) and approved, sorted by `createdAt` descending.
3. THE Admin_Review_Page SHALL display for each review: the reviewer's name, rating, body text, submission date, current approval status, and any existing `adminResponse`.
4. WHEN an admin clicks an "Approve" action on a pending review, THE Admin_Review_Page SHALL send a PATCH request to `/api/reviews/[id]` with `{ "approved": true }` and update the displayed status without a full page reload.
5. WHEN an admin clicks a "Reject" action on an approved review, THE Admin_Review_Page SHALL send a PATCH request to `/api/reviews/[id]` with `{ "approved": false }` and update the displayed status without a full page reload.
6. THE Admin_Review_Page SHALL provide a text input area for each review where the admin can write or edit an `adminResponse`.
7. WHEN an admin submits a response for a review, THE Admin_Review_Page SHALL send a PATCH request to `/api/reviews/[id]` with the `adminResponse` value and display a confirmation on success.
8. THE Admin_Review_Page SHALL require an active admin session; IF the session is not valid, THEN THE Admin_Review_Page SHALL redirect to `/admin/login`.
9. THE Admin_Review_Page SHALL display a count of pending reviews awaiting approval.

---

### Requirement 13: Admin Response Visible to Customers

**User Story:** As a customer, I want to see the store owner's response to a review, so that I can understand how the business engages with its customers.

#### Acceptance Criteria

1. WHEN a review displayed in the Testimonials_Section has a non-empty `adminResponse`, THE Testimonials_Section SHALL render the `adminResponse` text visually associated with that review (e.g., below the review body, labeled "Response from the store").
2. WHEN a review has no `adminResponse`, THE Testimonials_Section SHALL not render any response section for that review.
3. THE Testimonials_Section SHALL visually distinguish the admin response from the customer review text.

---

### Requirement 14: Review Submission UI

**User Story:** As a customer, I want a simple form on the homepage to submit my review, so that I can share my experience without navigating away.

#### Acceptance Criteria

1. THE Testimonials_Section SHALL include a review submission form with fields for `reviewerName`, `rating` (1–5 star selector), and `body`.
2. WHEN a customer submits the form with all required fields, THE Testimonials_Section SHALL POST to `/api/reviews` and display a success message: "Thank you! Your review has been submitted for approval."
3. WHEN a customer submits the form with missing required fields, THE Testimonials_Section SHALL display inline validation errors without making an API call.
4. WHILE a review submission is in progress, THE Testimonials_Section SHALL disable the submit button to prevent duplicate submissions.
5. IF the POST request to `/api/reviews` fails, THEN THE Testimonials_Section SHALL display an error message: "Something went wrong. Please try again."
6. WHEN a review is successfully submitted, THE Testimonials_Section SHALL reset the form fields to their default empty state.

---

### Requirement 15: Social Contact Links

**User Story:** As a customer, I want to find the store's social media and contact channels easily, so that I can follow the store and reach out for purchases or inquiries.

#### Acceptance Criteria

1. THE site footer or contact section SHALL display a WhatsApp contact link using the number `+393519420168`.
2. THE site footer or contact section SHALL display a link to the store's Instagram profile at `https://www.instagram.com/judy_haircollection`.
3. THE site footer or contact section SHALL display a link to the store's TikTok profile at `https://www.tiktok.com/@judy.hair.collect`.
4. WHEN a customer clicks the WhatsApp contact link, THE site SHALL open a WhatsApp chat in a new browser tab using the `wa.me/393519420168` URL format.
5. WHEN a customer clicks the Instagram or TikTok links, THE site SHALL open the respective profile in a new browser tab.
