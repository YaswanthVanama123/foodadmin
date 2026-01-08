import React, { useState, useMemo } from 'react';
import { Plus, Trash } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import SearchBar from '../components/common/SearchBar';
import { MenuTable, MenuItemForm } from '../components/menu';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Modal, { ModalBody, ModalFooter } from '../components/ui/Modal';
import { useMenu } from '../hooks/useMenu';
import { useCategories } from '../hooks/useCategories';
import { MenuItem, MenuItemFormData } from '../types';

const Menu: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>();
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const { categories } = useCategories();
  const { items, isLoading, createItem, updateItem, deleteItem } = useMenu();

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === '' || item.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const handleAddItem = () => {
    setSelectedItem(undefined);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteItem(itemToDelete._id);
        setItemToDelete(null);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleSubmit = async (data: MenuItemFormData, image?: File) => {
    if (selectedItem) {
      await updateItem(selectedItem._id, data, image);
    } else {
      await createItem(data, image);
    }
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Menu Management"
        subtitle="Manage your restaurant's menu items"
      >
        <Button variant="primary" onClick={handleAddItem}>
          <Plus className="h-5 w-5 mr-2" />
          Add Item
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search menu items..."
            onSearch={setSearchQuery}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categoryOptions}
          />
        </div>
      </div>

      <MenuTable
        items={filteredItems}
        categories={categories}
        isLoading={isLoading}
        onEdit={handleEditItem}
        onDelete={handleDeleteClick}
      />

      <MenuItemForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        item={selectedItem}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Delete Menu Item"
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
            <p className="text-sm text-gray-500">
              Do you really want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setItemToDelete(null)}>
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

export default Menu;
