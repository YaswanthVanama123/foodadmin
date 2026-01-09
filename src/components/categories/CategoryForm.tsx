import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Checkbox from '../ui/Checkbox';
import { Category, CategoryFormData } from '../../types';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  category?: Category;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    displayOrder: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        displayOrder: category.displayOrder,
        isActive: category.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        displayOrder: 0,
        isActive: true,
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {};

    // Name validation: 2-50 characters (matches backend)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must not exceed 50 characters';
    }

    // Description validation: max 200 characters (matches backend)
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'Description must not exceed 200 characters';
    }

    // Display order validation: minimum 0 (matches backend)
    if (formData.displayOrder < 0) {
      newErrors.displayOrder = 'Display order must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Category Name"
              placeholder="e.g., Appetizers, Main Courses"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />

            <TextArea
              label="Description"
              placeholder="Describe this category..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description}
              rows={3}
              required
            />

            <Input
              label="Display Order"
              type="number"
              placeholder="0"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
              }
              error={errors.displayOrder}
              helperText="Lower numbers appear first"
              required
            />

            <div className="border-t border-gray-200 pt-4">
              <Checkbox
                label="Active"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                helperText="Only active categories are visible to customers"
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {category ? 'Update Category' : 'Add Category'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default CategoryForm;
