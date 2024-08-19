import { useState } from 'react';
import { UploadedFile } from '../types';

interface FileTileProps {
  file: UploadedFile,
  onUpdateFile: (fileId: number, fileData: Partial<UploadedFile>) => void
}

export const FileTile: React.FC<FileTileProps> = ({ file, onUpdateFile }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = () => {
    setIsUpdating(true);
    try {
      onUpdateFile(file.id, {active: !file.active});
    } catch (error) {
      console.error('Error updating file:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={`flex items-center p-2 bg-white rounded-lg shadow-sm border-2 transition-colors duration-200 cursor-pointer ${
        file.active ? 'border-blue-500' : 'border-gray-200'
      } ${isUpdating ? 'opacity-50' : ''}`}
      onClick={handleClick}
    >
      <span className="ml-2 text-sm font-medium text-gray-700 truncate">{file.filename}</span>
    </div>
  );
};
