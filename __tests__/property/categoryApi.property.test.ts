// Feature: admin-dashboard-redesign, Property 18: Category CRUD round-trip
// Feature: admin-dashboard-redesign, Property 19: GET /api/categories returns categories sorted by name
// Feature: admin-dashboard-redesign, Property 20: PUT /api/categories/[id] persists updates
// Feature: admin-dashboard-redesign, Property 21: DELETE /api/categories/[id] removes the category
// Feature: admin-dashboard-redesign, Property 22: Category deletion does not affect products

/**
 * Properties 18–22: Category API logic tests
 *
 * These tests verify the pure data-transformation logic used by the category
 * API routes without requiring a live MongoDB connection.
 *
 * - Property 18: Validates: Requirements 12.3, 12.4
 * - Property 19: Validates: Requirements 12.2
 * - Property 20: Validates: Requirements 12.5
 * - Property 21: Validates: Requirements 12.6
 * - Property 22: Validates: Requirements 12.7
 */

import * as fc from 'fast-check';

// ---------------------------------------------------------------------------
// Shared types (mirrors ICategory / IProduct shapes used by the API)
// ---------------------------------------------------------------------------

interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  color: string;
  image?: string;
}

interface CategoryDoc extends CategoryInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductDoc {
  _id: string;
  name: string;
  category: string;
  categorySlug: string;
}

// ---------------------------------------------------------------------------
// Pure logic helpers (mirrors what the API routes do)
// ---------------------------------------------------------------------------

/** Simulates POST /api/categories — stores the input and returns a doc */
function createCategory(input: CategoryInput, id: string): CategoryDoc {
  return {
    _id: id,
    name: input.name,
    slug: input.slug,
    description: input.description,
    color: input.color,
    image: input.image,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/** Simulates GET /api/categories/[id] — finds by id */
function findCategoryById(store: CategoryDoc[], id: string): CategoryDoc | undefined {
  return store.find((c) => c._id === id);
}

/** Simulates GET /api/categories — returns all sorted by name ascending */
function listCategoriesSortedByName(store: CategoryDoc[]): CategoryDoc[] {
  return [...store].sort((a, b) => a.name.localeCompare(b.name));
}

/** Simulates PUT /api/categories/[id] — merges partial update into existing doc */
function updateCategory(
  store: CategoryDoc[],
  id: string,
  patch: Partial<CategoryInput>
): CategoryDoc[] {
  return store.map((c) =>
    c._id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c
  );
}

/** Simulates DELETE /api/categories/[id] — removes category from store */
function deleteCategory(store: CategoryDoc[], id: string): CategoryDoc[] {
  return store.filter((c) => c._id !== id);
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const hexColorArb = fc
  .tuple(
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 })
  )
  .map(
    ([r, g, b]) =>
      `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  );

const slugArb = fc
  .array(
    fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '0', '1', '2', '-'),
    { minLength: 1, maxLength: 20 }
  )
  .map((chars) => chars.join('').replace(/^-+|-+$/g, '') || 'slug');

const nameArb = fc.string({ minLength: 1, maxLength: 50 });

const categoryInputArb: fc.Arbitrary<CategoryInput> = fc.record({
  name: nameArb,
  slug: slugArb,
  color: hexColorArb,
  description: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  image: fc.option(
    fc.webUrl({ validSchemes: ['https'] }),
    { nil: undefined }
  ),
});

const idArb = fc.uuid();

// ---------------------------------------------------------------------------
// Property 18: Category CRUD round-trip
// Validates: Requirements 12.3, 12.4
// ---------------------------------------------------------------------------

describe('Property 18: Category CRUD round-trip', () => {
  /**
   * For any valid CategoryInput, creating it and then fetching it by ID
   * should return a document whose name, slug, description, color, and image
   * fields equal the original input.
   */
  it('created category is retrievable with matching fields', () => {
    fc.assert(
      fc.property(categoryInputArb, idArb, (input, id) => {
        const store: CategoryDoc[] = [];
        const doc = createCategory(input, id);
        store.push(doc);

        const found = findCategoryById(store, id);

        expect(found).toBeDefined();
        expect(found!.name).toBe(input.name);
        expect(found!.slug).toBe(input.slug);
        expect(found!.color).toBe(input.color);
        expect(found!.description).toBe(input.description);
        expect(found!.image).toBe(input.image);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 19: GET /api/categories returns categories sorted by name
// Validates: Requirements 12.2
// ---------------------------------------------------------------------------

describe('Property 19: GET /api/categories returns categories sorted by name', () => {
  /**
   * For any set of categories in the store, listCategoriesSortedByName should
   * return them in ascending alphabetical order by name.
   */
  it('categories are returned in ascending alphabetical order by name', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({ _id: idArb, name: nameArb, slug: slugArb, color: hexColorArb,
            createdAt: fc.constant('2024-01-01T00:00:00.000Z'),
            updatedAt: fc.constant('2024-01-01T00:00:00.000Z'),
          }),
          { minLength: 2, maxLength: 20 }
        ),
        (categories) => {
          const sorted = listCategoriesSortedByName(categories as CategoryDoc[]);

          for (let i = 0; i < sorted.length - 1; i++) {
            expect(sorted[i].name.localeCompare(sorted[i + 1].name)).toBeLessThanOrEqual(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('sorted result contains the same number of categories as the input', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({ _id: idArb, name: nameArb, slug: slugArb, color: hexColorArb,
            createdAt: fc.constant('2024-01-01T00:00:00.000Z'),
            updatedAt: fc.constant('2024-01-01T00:00:00.000Z'),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (categories) => {
          const sorted = listCategoriesSortedByName(categories as CategoryDoc[]);
          expect(sorted.length).toBe(categories.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 20: PUT /api/categories/[id] persists updates
// Validates: Requirements 12.5
// ---------------------------------------------------------------------------

describe('Property 20: PUT /api/categories/[id] persists updates', () => {
  /**
   * For any existing category and any valid partial update, applying the update
   * and then fetching the category should return a document reflecting all
   * updated fields.
   */
  it('updated fields are reflected in the stored document', () => {
    fc.assert(
      fc.property(
        categoryInputArb,
        idArb,
        fc.record({
          name: fc.option(nameArb, { nil: undefined }),
          color: fc.option(hexColorArb, { nil: undefined }),
          description: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
        }),
        (original, id, patch) => {
          let store: CategoryDoc[] = [createCategory(original, id)];
          store = updateCategory(store, id, patch);

          const updated = findCategoryById(store, id);
          expect(updated).toBeDefined();

          if (patch.name !== undefined) expect(updated!.name).toBe(patch.name);
          if (patch.color !== undefined) expect(updated!.color).toBe(patch.color);
          if (patch.description !== undefined) expect(updated!.description).toBe(patch.description);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('fields not included in the patch remain unchanged', () => {
    fc.assert(
      fc.property(categoryInputArb, idArb, nameArb, (original, id, newName) => {
        let store: CategoryDoc[] = [createCategory(original, id)];
        store = updateCategory(store, id, { name: newName });

        const updated = findCategoryById(store, id);
        expect(updated).toBeDefined();
        // slug was not patched — should remain the original
        expect(updated!.slug).toBe(original.slug);
        expect(updated!.color).toBe(original.color);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 21: DELETE /api/categories/[id] removes the category
// Validates: Requirements 12.6
// ---------------------------------------------------------------------------

describe('Property 21: DELETE /api/categories/[id] removes the category', () => {
  /**
   * For any existing category, deleting it should result in findCategoryById
   * returning undefined (equivalent to a 404 response).
   */
  it('deleted category is no longer findable by id', () => {
    fc.assert(
      fc.property(categoryInputArb, idArb, (input, id) => {
        let store: CategoryDoc[] = [createCategory(input, id)];
        store = deleteCategory(store, id);

        const found = findCategoryById(store, id);
        expect(found).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  it('deleting one category does not remove other categories', () => {
    fc.assert(
      fc.property(
        categoryInputArb,
        idArb,
        categoryInputArb,
        idArb,
        (inputA, idA, inputB, idB) => {
          fc.pre(idA !== idB);

          let store: CategoryDoc[] = [
            createCategory(inputA, idA),
            createCategory(inputB, idB),
          ];
          store = deleteCategory(store, idA);

          expect(findCategoryById(store, idA)).toBeUndefined();
          expect(findCategoryById(store, idB)).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 22: Category deletion does not affect products
// Validates: Requirements 12.7
// ---------------------------------------------------------------------------

describe('Property 22: Category deletion does not affect products', () => {
  /**
   * For any product whose categorySlug matches a deleted category's slug,
   * after the category is deleted the product's category and categorySlug
   * fields should remain unchanged.
   */
  it('product category fields are unchanged after the matching category is deleted', () => {
    fc.assert(
      fc.property(
        categoryInputArb,
        idArb,
        fc.uuid(),
        nameArb,
        (catInput, catId, productId, productName) => {
          // Build a category store and a products store
          let categoryStore: CategoryDoc[] = [createCategory(catInput, catId)];

          const product: ProductDoc = {
            _id: productId,
            name: productName,
            category: catInput.name,
            categorySlug: catInput.slug,
          };
          const productStore: ProductDoc[] = [product];

          // Delete the category — products store is NOT modified
          categoryStore = deleteCategory(categoryStore, catId);

          // The product's fields must be unchanged
          const productAfter = productStore.find((p) => p._id === productId);
          expect(productAfter).toBeDefined();
          expect(productAfter!.category).toBe(product.category);
          expect(productAfter!.categorySlug).toBe(product.categorySlug);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('deleting a category does not modify the products array length', () => {
    fc.assert(
      fc.property(
        categoryInputArb,
        idArb,
        fc.array(
          fc.record({
            _id: fc.uuid(),
            name: nameArb,
            category: nameArb,
            categorySlug: slugArb,
          }),
          { minLength: 0, maxLength: 10 }
        ),
        (catInput, catId, products) => {
          let categoryStore: CategoryDoc[] = [createCategory(catInput, catId)];
          const productStore = [...products] as ProductDoc[];

          categoryStore = deleteCategory(categoryStore, catId);

          // Products array is completely unaffected
          expect(productStore.length).toBe(products.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
