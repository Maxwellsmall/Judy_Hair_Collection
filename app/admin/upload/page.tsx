"use client";

import { useState } from "react";
import { uploadApi } from "../../../src/lib/api";
import { Upload, X, Check, Loader2 } from "lucide-react";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const response = await uploadApi.uploadMultiple(files);
      if (response.success && response.data) {
        const urls = response.data.images.map((img) => img.secureUrl);
        setUploadedUrls([...uploadedUrls, ...urls]);
        setFiles([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-neutral-900">
          Upload Images
        </h1>
        <p className="text-neutral-600 font-body mt-2">
          Upload product images to Cloudinary
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="border-2 border-dashed border-neutral-200 rounded-xl p-12 text-center hover:border-neutral-300 transition-colors">
          <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Select files to upload
          </h3>
          <p className="text-neutral-500 mb-6">
            PNG, JPG or WebP. Max 5MB per file.
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-neutral-900 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer hover:bg-neutral-800 transition-colors"
          >
            Browse Files
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-8 space-y-4">
            <h4 className="font-semibold text-neutral-900">Selected Files</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-100"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-neutral-200 rounded flex-shrink-0" />
                    <span className="text-sm text-neutral-700 truncate">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-neutral-200 rounded"
                  >
                    <X className="h-4 w-4 text-neutral-500" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg font-semibold hover:bg-neutral-800 transition-colors disabled:bg-neutral-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload to Cloudinary"
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {uploadedUrls.length > 0 && (
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-neutral-900">Recent Uploads</h4>
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                {uploadedUrls.length} file(s) uploaded
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {uploadedUrls.map((url, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden border border-neutral-200">
                  <img src={url} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
