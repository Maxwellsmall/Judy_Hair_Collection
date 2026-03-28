"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Review {
  _id: string;
  reviewerName: string;
  rating: number;
  body: string;
  approved: boolean;
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

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState<Record<string, string>>({});
  const [savingResponse, setSavingResponse] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/reviews/admin")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.success) {
          setReviews(data.data.reviews);
          const initial: Record<string, string> = {};
          data.data.reviews.forEach((r: Review) => {
            initial[r._id] = r.adminResponse ?? "";
          });
          setResponseText(initial);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const toggleApproval = async (review: Review) => {
    const newApproved = !review.approved;
    // Optimistic update
    setReviews((prev) =>
      prev.map((r) => (r._id === review._id ? { ...r, approved: newApproved } : r))
    );

    try {
      const res = await fetch(`/api/reviews/${review._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: newApproved }),
      });
      if (!res.ok) throw new Error();
      toast.success(newApproved ? "Review approved" : "Review rejected");
    } catch {
      // Revert on failure
      setReviews((prev) =>
        prev.map((r) => (r._id === review._id ? { ...r, approved: review.approved } : r))
      );
      toast.error("Failed to update review");
    }
  };

  const saveResponse = async (reviewId: string) => {
    setSavingResponse((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminResponse: responseText[reviewId] }),
      });
      if (!res.ok) throw new Error();
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId ? { ...r, adminResponse: responseText[reviewId] } : r
        )
      );
      toast.success("Response saved");
    } catch {
      toast.error("Failed to save response");
    } finally {
      setSavingResponse((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const pendingCount = reviews.filter((r) => !r.approved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Reviews</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage customer reviews</p>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            <MessageSquare className="h-4 w-4" />
            {pendingCount} pending
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-center text-neutral-500 py-20">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-xl border border-neutral-200 bg-white p-6 flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900">{review.reviewerName}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        review.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {review.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <StarDisplay rating={review.rating} />
                  <p className="text-xs text-neutral-400">
                    {new Date(review.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <button
                  onClick={() => toggleApproval(review)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    review.approved
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {review.approved ? (
                    <>
                      <XCircle className="h-4 w-4" /> Reject
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" /> Approve
                    </>
                  )}
                </button>
              </div>

              {/* Body */}
              <p className="text-neutral-700 leading-relaxed">&ldquo;{review.body}&rdquo;</p>

              {/* Admin response */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-700">
                  Your response (visible to customers)
                </label>
                <textarea
                  value={responseText[review._id] ?? ""}
                  onChange={(e) =>
                    setResponseText((prev) => ({ ...prev, [review._id]: e.target.value }))
                  }
                  rows={3}
                  maxLength={1000}
                  placeholder="Write a response..."
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => saveResponse(review._id)}
                    disabled={savingResponse[review._id]}
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {savingResponse[review._id] ? "Saving..." : "Save Response"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
