import React from 'react';
import { Users, Trash2, Edit, Circle } from 'lucide-react';
import Card, { CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Table } from '../../types';

interface TableCardProps {
  table: Table;
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onEdit, onDelete }) => {
  return (
    <Card hover>
      <CardBody>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Table {table.tableNumber}
              </h3>
              {table.location && (
                <p className="text-sm text-gray-500 mt-1">{table.location}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Circle
                className={`h-3 w-3 ${
                  table.isOccupied
                    ? 'fill-red-500 text-red-500'
                    : 'fill-green-500 text-green-500'
                } animate-pulse`}
              />
              <Badge variant={table.isOccupied ? 'danger' : 'success'}>
                {table.isOccupied ? 'Occupied' : 'Available'}
              </Badge>
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">
              Capacity: {table.capacity} {table.capacity === 1 ? 'person' : 'people'}
            </span>
          </div>

          {/* Status */}
          {!table.isActive && (
            <Badge variant="gray">Inactive</Badge>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(table)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(table)}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TableCard;
