"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, CheckCircle2, Clock, MessageSquare, Pencil, Check, X, Trash2 } from "lucide-react";
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
          className={`h-4 w-4 ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  onToggleApproval,
  onSaveResponse,
  onDelete,
}: {
  review: Review;
  onToggleApproval: (review: Review) => Promise<void>;
  onSaveResponse: (id: string, text: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [toggling, setToggling] = useState(false);
  const [editingResponse, setEditingResponse] = useState(false);
  const [responseText, setResponseText] = useState(review.adminResponse ?? "");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const hasResponse = Boolean(review.adminResponse);

  const handleToggle = async () => {
    setToggling(true);
    await onToggleApproval(review);
    setToggling(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSaveResponse(review._id, responseText);
    setSaving(false);
    setEditingResponse(false);
  };

  const handleCancel = () => {
    setResponseText(review.adminResponse ?? "");
    setEditingResponse(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(review._id);
    setDeleting(false);
    setConfirmDelete(false);
  };

  return (
    <div className={`rounded-2xl border bg-white overflow-hidden transition-all ${
      review.approved ? "border-neutral-200" : "border-amber-200 bg-amber-50/30"
    }`}>
      {/* Status bar */}
      <div className={`px-5 py-2.5 flex items-center justify-between text-xs font-semibold ${
        review.approved
          ? "bg-green-50 text-green-700 border-b border-green-100"
          : "bg-amber-50 text-amber-700 border-b border-amber-100"
      }`}>
        <div className="flex items-center gap-1.5">
          {review.approved
            ? <><CheckCircle2 className="h-3.5 w-3.5" /> Approved</>
            : <><Clock className="h-3.5 w-3.5" /> Pending approval</>
          }
        </div>
        <div className="flex items-center gap-3">
          <span className="font-normal text-neutral-400">
            {new Date(review.createdAt).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
          {/* Delete */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-neutral-400 hover:text-red-500 transition-colors"
              aria-label="Delete review"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-red-600 font-semibold">Delete?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded px-2 py-0.5 bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "..." : "Yes"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded px-2 py-0.5 bg-neutral-200 text-neutral-700 text-xs font-bold hover:bg-neutral-300"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Reviewer info + rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-600 flex-shrink-0">
              {review.reviewerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-neutral-900 text-sm">{review.reviewerName}</p>
              <StarDisplay rating={review.rating} />
            </div>
          </div>

          {/* Approve / Reject button */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all shadow-sm active:scale-95 ${
              review.approved
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200"
                : "bg-green-500 hover:bg-green-600 text-white shadow-green-200"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {toggling ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : review.approved ? (
              <><X className="h-4 w-4" /> Revoke</>
            ) : (
              <><CheckCircle2 className="h-4 w-4" /> Approve Now</>
            )}
          </button>
        </div>

        {/* Review body */}
        <p className="text-sm text-neutral-700 leading-relaxed border-l-2 border-neutral-200 pl-3 italic">
          &ldquo;{review.body}&rdquo;
        </p>

        {/* Admin response section */}
        <div className={`rounded-xl p-4 ${
          hasResponse && !editingResponse
            ? "bg-amber-50 border border-amber-200"
            : "bg-neutral-50 border border-neutral-200"
        }`}>
          {hasResponse && !editingResponse ? (
            // Saved response view
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Your response
                </div>
                <button
                  onClick={() => setEditingResponse(true)}
                  className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
              </div>
              <p className="text-sm text-neutral-700">{review.adminResponse}</p>
            </div>
          ) : editingResponse ? (
            // Edit mode
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-neutral-600">Edit your response</p>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={3}
                maxLength={1000}
                autoFocus
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none bg-white"
                placeholder="Write your response..."
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-xs rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            // No response yet
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-neutral-500">Reply to this review</p>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={2}
                maxLength={1000}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none bg-white"
                placeholder="Write a response visible to customers..."
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving || !responseText.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <MessageSquare className="h-3 w-3" />
                  )}
                  {saving ? "Saving..." : "Post Response"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews/admin", { credentials: "include" })
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then((data) => {
        if (data?.success) setReviews(data.data.reviews);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const toggleApproval = async (review: Review) => {
    const newApproved = !review.approved;
    setReviews((prev) => prev.map((r) => r._id === review._id ? { ...r, approved: newApproved } : r));
    try {
      const res = await fetch(`/api/reviews/${review._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ approved: newApproved }),
      });
      if (!res.ok) throw new Error();
      toast.success(newApproved ? "Review approved — now visible on site" : "Review revoked");
    } catch {
      setReviews((prev) => prev.map((r) => r._id === review._id ? { ...r, approved: review.approved } : r));
      toast.error("Failed to update review");
    }
  };

  const saveResponse = async (reviewId: string, text: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ adminResponse: text }),
      });
      if (!res.ok) throw new Error();
      setReviews((prev) => prev.map((r) => r._id === reviewId ? { ...r, adminResponse: text } : r));
      toast.success("Response posted — visible to customers");
    } catch {
      toast.error("Failed to save response");
      throw new Error("save failed");
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
      throw new Error("delete failed");
    }
  };
  const pendingCount = reviews.filter((r) => !r.approved).length;
  const approvedCount = reviews.filter((r) => r.approved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Reviews</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage and respond to customer reviews</p>
        </div>
        <div className="flex gap-2">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-700">
              <Clock className="h-4 w-4" />
              {pendingCount} pending
            </span>
          )}
          {approvedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              {approvedCount} live
            </span>
          )}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-neutral-200 p-16 text-center">
          <MessageSquare className="h-10 w-10 mx-auto text-neutral-300 mb-3" />
          <p className="text-neutral-500 font-medium">No reviews yet</p>
          <p className="text-sm text-neutral-400 mt-1">Customer reviews will appear here once submitted</p>
        </div>
      ) : (
        <>
          {/* Pending first, then approved */}
          {[...reviews].sort((a, b) => Number(a.approved) - Number(b.approved)).map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onToggleApproval={toggleApproval}
              onSaveResponse={saveResponse}
              onDelete={deleteReview}
            />
          ))}
        </>
      )}
    </div>
  );
}
