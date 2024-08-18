interface DataTableProps<T extends Record<string, unknown>> {
  title?: string;
  data: T[];
}

export const DataTable = <T extends Record<string, unknown>>({ title, data }: DataTableProps<T>): JSX.Element => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }
  const columns = Object.keys(data[0]);

  const formatCellValue = (value: unknown): React.ReactNode => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="p-4">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((column, index) => (
              <th key={index} className="border border-gray-300 p-2 text-left">
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-2">
                    {formatCellValue(row[column as keyof T])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
      </table>
    </div>
  );
};
