import React, { useState } from 'react';
import { DataTable } from './DataTable';
import { Conversation } from '../types';

interface DataDisplayProps {
  conversation: Conversation;
}

export const DataDisplay: React.FC<DataDisplayProps> = ({ conversation }) => {
  const [rowCount, setRowCount] = useState(10);
  const [appliedRowCount, setAppliedRowCount] = useState(10);

  const handleRowCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    setRowCount(count);
  };

  const handleApplyRowCount = () => {
    setAppliedRowCount(rowCount);
  };

  const activeFiles = conversation.files.filter(file => file.active && file.data !== null);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Files Data</h2>
        <div className="flex items-center mb-4">
          <label htmlFor="rowCount" className="mr-2">
            Number of rows to display:
          </label>
          <input
            type="number"
            id="rowCount"
            value={rowCount}
            onChange={handleRowCountChange}
            className="border border-gray-300 p-1 rounded w-20 mr-2"
            min="1"
          />
          <button
            onClick={handleApplyRowCount}
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Apply
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        { activeFiles.length > 0 ?
          activeFiles.map(file => {
            return (
              <div key={file.id} className="mb-8">
                <h3 className="text-xl font-semibold mb-2">{file.filename}</h3>
                <DataTable data={file.data.data.slice(0, appliedRowCount)} />
              </div>
            );
          }
        ) : (
          <p className="p-4 text-gray-500">No active files to display.</p>
        )}
      </div>
    </div>
  );
};
