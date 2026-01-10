import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash, Edit, Check, X } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/ui/Button';
import Modal, { ModalBody, ModalFooter } from '../components/ui/Modal';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import Checkbox from '../components/ui/Checkbox';
import Card, { CardBody } from '../components/ui/Card';
import { addOnsApi } from '../api/addons.api';
import { AddOn, AddOnFormData } from '../types';

const AddOns: React.FC = () => {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAddOn, setSelectedAddOn] = useState<AddOn | undefined>();
  const [addOnToDelete, setAddOnToDelete] = useState<AddOn | null>(null);

  const isFetching = useRef(false);

  const fetchAddOns = async () => {
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setIsLoading(true);
      setError(null);
      const data = await addOnsApi.getAll();
      setAddOns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load add-ons');
      console.error('Error fetching add-ons:', err);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchAddOns();
  }, []);

  const handleAdd = () => {
    setSelectedAddOn(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (addOn: AddOn) => {
    setSelectedAddOn(addOn);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (addOn: AddOn) => {
    setAddOnToDelete(addOn);
  };

  const handleDeleteConfirm = async () => {
    if (addOnToDelete) {
      try {
        await addOnsApi.delete(addOnToDelete._id);
        await fetchAddOns();
        setAddOnToDelete(null);
      } catch (error) {
        console.error('Error deleting add-on:', error);
      }
    }
  };

  const handleToggleAvailability = async (addOn: AddOn) => {
    try {
      await addOnsApi.toggleAvailability(addOn._id);
      await fetchAddOns();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const handleSubmit = async (data: AddOnFormData) => {
    if (selectedAddOn) {
      await addOnsApi.update(selectedAddOn._id, data);
    } else {
      await addOnsApi.create(data);
    }
    await fetchAddOns();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Add-Ons" subtitle="Manage reusable add-ons for menu items" />
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Add-Ons" subtitle="Manage reusable add-ons for menu items" />
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchAddOns}>Retry</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add-Ons"
        subtitle="Manage reusable add-ons that can be linked to multiple menu items"
      >
        <Button variant="primary" onClick={handleAdd}>
          <Plus className="h-5 w-5 mr-2" />
          Add Add-On
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {addOns.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardBody className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No add-ons yet</h3>
                <p className="text-gray-500 mb-4">
                  Create reusable add-ons that can be linked to multiple menu items
                </p>
                <Button variant="primary" onClick={handleAdd}>
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Add-On
                </Button>
              </CardBody>
            </Card>
          </div>
        ) : (
          addOns.map((addOn) => (
            <Card key={addOn._id} className="hover:shadow-lg transition-shadow">
              <CardBody>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{addOn.name}</h3>
                      {addOn.description && (
                        <p className="text-sm text-gray-500 mt-1">{addOn.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleAvailability(addOn)}
                      className={`ml-2 p-1.5 rounded-full transition-colors ${
                        addOn.isAvailable
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={addOn.isAvailable ? 'Available' : 'Unavailable'}
                    >
                      {addOn.isAvailable ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-lg font-bold text-indigo-600">
                      +${addOn.price.toFixed(2)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(addOn)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(addOn)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      <AddOnForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        addOn={selectedAddOn}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!addOnToDelete}
        onClose={() => setAddOnToDelete(null)}
        title="Delete Add-On"
        size="sm"
      >
        <ModalBody>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Trash className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-500">
              Do you really want to delete "{addOnToDelete?.name}"? This will remove it from all
              menu items.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setAddOnToDelete(null)}>
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

// Add-On Form Component
interface AddOnFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddOnFormData) => Promise<void>;
  addOn?: AddOn;
}

const AddOnForm: React.FC<AddOnFormProps> = ({ isOpen, onClose, onSubmit, addOn }) => {
  const [formData, setFormData] = useState<AddOnFormData>({
    name: '',
    description: '',
    price: 0,
    isAvailable: true,
    displayOrder: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AddOnFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (addOn) {
      setFormData({
        name: addOn.name,
        description: addOn.description || '',
        price: addOn.price,
        isAvailable: addOn.isAvailable,
        displayOrder: addOn.displayOrder,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        isAvailable: true,
        displayOrder: 0,
      });
    }
    setErrors({});
  }, [addOn, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AddOnFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (formData.price < 0) {
      newErrors.price = 'Price must be positive';
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
      title={addOn ? 'Edit Add-On' : 'Create Add-On'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Name"
              placeholder="e.g., Extra Cheese, Side Salad"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />

            <TextArea
              label="Description (Optional)"
              placeholder="Describe the add-on..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />

            <Input
              label="Price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
              }
              error={errors.price}
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
              helperText="Lower numbers appear first"
            />

            <Checkbox
              label="Available for ordering"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {addOn ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AddOns;
