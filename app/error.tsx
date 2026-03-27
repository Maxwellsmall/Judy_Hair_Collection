'use client';


export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neutral-900 mb-4">500</h1>
        <p className="text-xl text-neutral-600 mb-8">Something went wrong</p>
        <button
          onClick={reset}
          className="bg-neutral-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
