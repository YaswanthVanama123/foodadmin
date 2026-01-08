import React, { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { CategoryList, CategoryForm } from '../components/categories';
import Button from '../components/ui/Button';
import Modal, { ModalBody, ModalFooter } from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import { useCategories } from '../hooks/useCategories';
import { Category, CategoryFormData } from '../types';

const Categories: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { categories, isLoading, createCategory, updateCategory, deleteCategory, toggleStatus } =
    useCategories();

  const handleAddCategory = () => {
    setSelectedCategory(undefined);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete._id);
        setCategoryToDelete(null);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      await toggleStatus(category._id);
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  const handleSubmit = async (data: CategoryFormData) => {
    if (selectedCategory) {
      await updateCategory(selectedCategory._id, data);
    } else {
      await createCategory(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Category Management"
        subtitle="Organize your menu items into categories"
      >
        <Button variant="primary" onClick={handleAddCategory}>
          <Plus className="h-5 w-5 mr-2" />
          Add Category
        </Button>
      </PageHeader>

      <CategoryList
        categories={categories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
      />

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        category={selectedCategory}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        title="Delete Category"
        size="sm"
      >
        <ModalBody>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Trash className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Do you really want to delete "{categoryToDelete?.name}"?
            </p>
            <p className="text-sm text-red-600 font-medium">
              Warning: All menu items in this category will need to be reassigned.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setCategoryToDelete(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Categories;
