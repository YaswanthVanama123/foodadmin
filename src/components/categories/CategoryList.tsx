import React from 'react';
import { Edit, Trash } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Category } from '../../types';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg">
        <div className="text-gray-400 text-lg mb-2">No categories found</div>
        <p className="text-gray-500 text-sm">Get started by creating your first category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card key={category._id} hover className="relative">
          <CardBody className="pb-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {category.description}
                </p>
              </div>
              <Badge variant={category.isActive ? 'success' : 'danger'} size="sm">
                {category.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="flex items-center text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
              <span>Display Order: {category.displayOrder}</span>
            </div>
          </CardBody>

          <CardFooter className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(category)}
            >
              {category.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(category)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(category)}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CategoryList;
