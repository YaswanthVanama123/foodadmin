import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRowClick?: (item: T) => void;
  rowKey?: keyof T;
}

type SortDirection = 'asc' | 'desc' | null;

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data available',
  emptyIcon,
  onRowClick,
  rowKey = '_id' as keyof T,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortKey === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortKey, sortDirection]);

  if (isLoading) {
    return <LoadingState message="Loading data..." />;
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} icon={emptyIcon} />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <div className="flex flex-col">
                      {sortKey === column.key ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="h-4 w-4 text-indigo-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-indigo-600" />
                        )
                      ) : (
                        <div className="flex flex-col -space-y-1">
                          <ChevronUp className="h-3 w-3 text-gray-400" />
                          <ChevronDown className="h-3 w-3 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item) => (
            <tr
              key={String(item[rowKey])}
              onClick={() => onRowClick?.(item)}
              className={`${
                onRowClick
                  ? 'cursor-pointer hover:bg-gray-50 transition-colors'
                  : ''
              }`}
            >
              {columns.map((column) => (
                <td
                  key={`${String(item[rowKey])}-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
