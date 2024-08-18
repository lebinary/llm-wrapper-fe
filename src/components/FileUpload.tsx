import React, { useState } from 'react';

interface FileUploadProps {
  onUpload: (files: File[], title?: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onUpload(files, title);
    setFiles([]);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Conversation Title (optional)"
          className="border p-2 rounded"
        />
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          accept=".csv,.xls,.xlsx"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={files.length === 0}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
        >
          Upload Files
        </button>
      </div>
    </form>
  );
};
