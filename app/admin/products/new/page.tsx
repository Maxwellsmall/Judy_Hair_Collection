'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { X, Loader2 } from 'lucide-react';
import { categoriesApi, CategoryModel } from '@/lib/api';
import ImageUpload, { ImageUploadHandle } from '../../components/ImageUpload';

const COMMON_TAGS = ['Straight', 'Curly', 'Wavy', 'Bob', 'Long', 'Short'];

interface FormErrors {
  name?: string;
  price?: string;
  description?: string;
  category?: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const imageUploadRef = useRef<ImageUploadHandle>(null);

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState('');
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    categoriesApi.getAll().then((res) => {
      if (res.success && res.data) {
        setCategories(res.data.categories);
      }
    }).catch(() => {
      // non-fatal — dropdown will be empty
    });
  }, []);

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!price || parseFloat(price) <= 0) newErrors.price = 'A valid price is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Upload pending images
      let uploadedUrls: string[] = [];
      const pendingFiles = imageUploadRef.current?.getPendingFiles() ?? [];

      if (pendingFiles.length > 0) {
        const formData = new FormData();
        pendingFiles.forEach((file) => formData.append('images', file));
        const uploadRes = await fetch('/api/upload/multiple', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.message || 'Image upload failed');
        }
        const uploadData = await uploadRes.json();
        uploadedUrls = uploadData.data?.images?.map((img: { secureUrl: string }) => img.secureUrl) ?? [];
      }

      // Existing confirmed URLs (non-blob)
      const existingUrls = images.filter((url) => !url.startsWith('blob:'));
      const allImages = [...existingUrls, ...uploadedUrls];

      // Find selected category name + slug
      const selectedCategory = categories.find((c) => c._id === category);

      const body = {
        name: name.trim(),
        price: parseFloat(price),
        ...(originalPrice ? { originalPrice: parseFloat(originalPrice) } : {}),
        description: description.trim(),
        category: selectedCategory?.name ?? category,
        categorySlug: selectedCategory?.slug ?? '',
        tags,
        features: features.split('\n').map((f) => f.trim()).filter(Boolean),
        colors: colors.split(',').map((c) => c.trim()).filter(Boolean),
        sizes: sizes.split(',').map((s) => s.trim()).filter(Boolean),
        featured,
        images: allImages,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create product');
      }

      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Add Product</h1>
        <p className="text-sm text-neutral-500 mt-1">Fill in the details to create a new product.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            placeholder="e.g. Brazilian Body Wave Wig"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Price + Original Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Price (₦) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="0.00"
            />
            {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Original Price (₦) <span className="text-neutral-400 font-normal">optional</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            placeholder="Describe the product..."
          />
          {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-600 transition-colors"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            placeholder="Type a tag and press Enter"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {COMMON_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                disabled={tags.includes(tag)}
                className="text-xs px-2 py-1 rounded-full border border-neutral-300 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Features <span className="text-neutral-400 font-normal text-xs">(one per line)</span>
          </label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            rows={4}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            placeholder={"100% human hair\nLace front\nAdjustable strap"}
          />
        </div>

        {/* Colors + Sizes */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Colors <span className="text-neutral-400 font-normal text-xs">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Black, Brown, Blonde"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Sizes <span className="text-neutral-400 font-normal text-xs">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="10 inch, 12 inch, 14 inch"
            />
          </div>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300 accent-neutral-900"
          />
          <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
            Featured product
          </label>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Images</label>
          <ImageUpload
            ref={imageUploadRef}
            value={images}
            onChange={setImages}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Saving…' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            disabled={submitting}
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
