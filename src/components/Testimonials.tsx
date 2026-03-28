"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Review {
  _id: string;
  reviewerName: string;
  rating: number;
  body: string;
  adminResponse?: string;
  createdAt: string;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`}
        />
      ))}
    </div>
  );
}

function StarSelector({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              i <= (hovered ?? value ?? 0)
                ? "fill-amber-400 text-amber-400"
                : "text-neutral-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ name?: string; rating?: string; body?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    fetch("/api/reviews?limit=6")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setReviews(data.data.reviews);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!rating) e.rating = "Please select a rating";
    if (!body.trim()) e.body = "Review is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerName: name, rating, body }),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setName("");
        setRating(null);
        setBody("");
        setErrors({});
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading mb-3">
            What Our Customers Say
          </h2>
          <p className="text-lg text-neutral-600 font-body">
            Real reviews from real customers
          </p>
        </div>

        {/* Reviews grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-neutral-100 rounded-xl h-40" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-neutral-500 font-body mb-12">
            Be the first to leave a review.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-6"
              >
                <StarDisplay rating={review.rating} />
                <p className="text-neutral-700 font-body leading-relaxed">&ldquo;{review.body}&rdquo;</p>
                <p className="text-sm font-semibold text-neutral-900">— {review.reviewerName}</p>

                {review.adminResponse && (
                  <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1">Response from the store</p>
                    <p className="text-sm text-neutral-700">{review.adminResponse}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Submission form */}
        <div className="mx-auto max-w-xl rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Leave a Review</h3>

          {submitStatus === "success" ? (
            <p className="text-green-700 font-medium text-center py-4">
              Thank you! Your review has been submitted for approval.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 ${
                    errors.name ? "border-red-400" : "border-neutral-300"
                  }`}
                  placeholder="e.g. Chioma A."
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Rating</label>
                <StarSelector value={rating} onChange={setRating} />
                {errors.rating && <p className="mt-1 text-xs text-red-500">{errors.rating}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Review</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none ${
                    errors.body ? "border-red-400" : "border-neutral-300"
                  }`}
                  placeholder="Share your experience..."
                />
                <div className="flex justify-between mt-1">
                  {errors.body ? (
                    <p className="text-xs text-red-500">{errors.body}</p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs text-neutral-400">{body.length}/500</p>
                </div>
              </div>

              {submitStatus === "error" && (
                <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
