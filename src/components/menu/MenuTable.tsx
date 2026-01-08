import React from 'react';
import { Edit, Trash } from 'lucide-react';
import DataTable, { Column } from '../common/DataTable';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { MenuItem, Category } from '../../types';
import { formatCurrency } from '../../utils/format';

interface MenuTableProps {
  items: MenuItem[];
  categories: Category[];
  isLoading?: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

const MenuTable: React.FC<MenuTableProps> = ({
  items,
  categories,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId);
    return category?.name || 'Unknown';
  };

  const columns: Column<MenuItem>[] = [
    {
      key: 'image',
      label: 'Image',
      render: (item) => (
        <div className="flex-shrink-0 h-12 w-12">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-500 line-clamp-1">
            {item.description}
          </div>
        </div>
      ),
    },
    {
      key: 'categoryId',
      label: 'Category',
      sortable: true,
      render: (item) => (
        <Badge variant="secondary">{getCategoryName(item.categoryId)}</Badge>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(item.price)}
        </span>
      ),
    },
    {
      key: 'dietary',
      label: 'Dietary',
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.isVegetarian && (
            <Badge variant="success" size="sm">
              Veg
            </Badge>
          )}
          {item.isVegan && (
            <Badge variant="success" size="sm">
              Vegan
            </Badge>
          )}
          {item.isGlutenFree && (
            <Badge variant="info" size="sm">
              GF
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'isAvailable',
      label: 'Status',
      sortable: true,
      render: (item) => (
        <Badge variant={item.isAvailable ? 'success' : 'danger'}>
          {item.isAvailable ? 'Available' : 'Unavailable'}
        </Badge>
      ),
    },
    {
      key: 'preparationTime',
      label: 'Prep Time',
      sortable: true,
      render: (item) => (
        <span className="text-gray-700">{item.preparationTime} min</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={items}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No menu items found"
    />
  );
};

export default MenuTable;
