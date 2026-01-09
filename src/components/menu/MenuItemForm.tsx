import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import ImageUpload from './ImageUpload';
import CustomizationBuilder from './CustomizationBuilder';
import { MenuItem, MenuItemFormData, Category } from '../../types';

interface MenuItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MenuItemFormData, image?: File) => Promise<void>;
  item?: MenuItem;
  categories: Category[];
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  item,
  categories,
}) => {
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: '',
    description: '',
    categoryId: '',
    price: 0,
    originalPrice: undefined,
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isNonVeg: false,
    customizationOptions: [],
    preparationTime: 15,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof MenuItemFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        categoryId: item.categoryId,
        price: item.price,
        originalPrice: item.originalPrice,
        isAvailable: item.isAvailable,
        isVegetarian: item.isVegetarian,
        isVegan: item.isVegan,
        isGlutenFree: item.isGlutenFree,
        isNonVeg: item.isNonVeg || false,
        customizationOptions: item.customizationOptions,
        preparationTime: item.preparationTime,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        price: 0,
        originalPrice: undefined,
        isAvailable: true,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isNonVeg: false,
        customizationOptions: [],
        preparationTime: 15,
      });
      setImageFile(null);
    }
    setErrors({});
  }, [item, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MenuItemFormData, string>> = {};

    // Name validation: 2-100 characters (matches backend)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must not exceed 100 characters';
    }

    // Description validation: max 500 characters (matches backend)
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    // Price validation: minimum 0.01 (matches backend)
    if (formData.price < 0.01) {
      newErrors.price = 'Price must be at least $0.01';
    }

    // Original price validation: if provided, must be >= current price
    if (formData.originalPrice !== undefined && formData.originalPrice !== null) {
      if (formData.originalPrice < 0.01) {
        newErrors.originalPrice = 'Original price must be at least $0.01';
      } else if (formData.originalPrice < formData.price) {
        newErrors.originalPrice = 'Original price must be greater than or equal to current price';
      }
    }

    // Preparation time validation: minimum 0 (matches backend)
    if (formData.preparationTime < 0) {
      newErrors.preparationTime = 'Preparation time cannot be negative';
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
      await onSubmit(formData, imageFile || undefined);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = categories
    .filter((cat) => cat.isActive)
    .map((cat) => ({
      value: cat._id,
      label: cat.name,
    }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Edit Menu Item' : 'Add Menu Item'} size="lg">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Item Name"
              placeholder="e.g., Margherita Pizza"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />

            <TextArea
              label="Description"
              placeholder="Describe your menu item..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description}
              rows={3}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                options={categoryOptions}
                error={errors.categoryId}
                placeholder="Select category"
                required
              />

              <Input
                label="Price (After Discount)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                error={errors.price}
                helperText="Current selling price"
                required
              />

              <Input
                label="Original Price (Optional)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.originalPrice || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                  setFormData({ ...formData, originalPrice: value });
                }}
                error={errors.originalPrice}
                helperText="For showing discount to customers"
              />
            </div>

            <Input
              label="Preparation Time (minutes)"
              type="number"
              placeholder="15"
              value={formData.preparationTime}
              onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 0 })}
              error={errors.preparationTime}
              required
            />

            <ImageUpload
              value={item?.image}
              onChange={setImageFile}
            />

            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dietary Information
              </label>
              <div className="space-y-2">
                <Checkbox
                  label="Vegetarian"
                  checked={formData.isVegetarian}
                  onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                />
                <Checkbox
                  label="Vegan"
                  checked={formData.isVegan}
                  onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                />
                <Checkbox
                  label="Gluten Free"
                  checked={formData.isGlutenFree}
                  onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                />
                <Checkbox
                  label="Non-Veg"
                  checked={formData.isNonVeg}
                  onChange={(e) => setFormData({ ...formData, isNonVeg: e.target.checked })}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <Checkbox
                label="Available for ordering"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              />
            </div>

            <div className="border-t border-gray-200 pt-4">
              <CustomizationBuilder
                value={formData.customizationOptions}
                onChange={(customizations) =>
                  setFormData({ ...formData, customizationOptions: customizations })
                }
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {item ? 'Update Item' : 'Add Item'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default MenuItemForm;
