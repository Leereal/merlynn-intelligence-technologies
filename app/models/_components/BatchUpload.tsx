"use client";

import React, { useState } from "react";
import { uploadBatchFile } from "@/actions/decision.actions";

const BatchUpload: React.FC<{ modelId: string }> = ({ modelId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      const result = await uploadBatchFile(modelId, file);
      setUploadResult(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setUploadResult(null);
    }
  };

  return (
    <div className="batch-upload">
      <h2 className="text-xl font-semibold mb-4">Batch File Upload</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Upload
      </button>
      {uploadResult && (
        <div className="upload-result mt-4">
          <h3 className="text-lg font-medium">Upload Result</h3>
          <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default BatchUpload;
