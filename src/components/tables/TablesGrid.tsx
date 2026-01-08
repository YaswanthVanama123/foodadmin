import React from 'react';
import TableCard from './TableCard';
import { Table } from '../../types';

interface TablesGridProps {
  tables: Table[];
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
}

const TablesGrid: React.FC<TablesGridProps> = ({ tables, onEdit, onDelete }) => {
  if (tables.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tables found. Create your first table to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tables.map((table) => (
        <TableCard
          key={table._id}
          table={table}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TablesGrid;
