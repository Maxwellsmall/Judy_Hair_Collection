'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { categoriesApi } from '@/src/lib/api';
import { generateSlug } from '../../utils/slugGeneration';

interface FormErrors {
  name?: string;
  slug?: string;
  color?: string;
}

export default function NewCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#f59e0b');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(value));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value);
    setSlugManuallyEdited(true);
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!slug.trim()) newErrors.slug = 'Slug is required';
    if (!color.trim()) newErrors.color = 'Color is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      let imageUrl: string | undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch('/api/upload/single', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.message || 'Image upload failed');
        }
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.data?.secureUrl ?? uploadData.data?.url;
      }

      await categoriesApi.create({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        color,
        ...(imageUrl ? { image: imageUrl } : {}),
      });

      toast.success('Category created successfully');
      router.push('/admin/categories');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Add Category</h1>
        <p className="text-sm text-neutral-500 mt-1">Fill in the details to create a new category.</p>
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
            onChange={handleNameChange}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            placeholder="e.g. Lace Front Wigs"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={handleSlugChange}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            placeholder="e.g. lace-front-wigs"
          />
          <p className="text-xs text-neutral-400 mt-1">Auto-generated from name. Edit to override.</p>
          {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
            placeholder="Describe this category..."
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Color <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded-lg border border-neutral-300 cursor-pointer p-0.5"
            />
            <span className="text-sm text-neutral-600 font-mono">{color}</span>
          </div>
          {errors.color && <p className="text-xs text-red-600 mt-1">{errors.color}</p>}
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Image <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200 transition-colors"
          />
          {imageFile && (
            <p className="text-xs text-neutral-500 mt-1">{imageFile.name}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Saving…' : 'Create Category'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/categories')}
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
