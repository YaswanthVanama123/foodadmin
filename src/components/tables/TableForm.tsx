import React, { useState, useEffect } from 'react';
import Modal, { ModalBody, ModalFooter } from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Table, TableFormData } from '../../types';

interface TableFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TableFormData) => Promise<void>;
  table?: Table | null;
  isLoading?: boolean;
}

const TableForm: React.FC<TableFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  table,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<TableFormData>({
    tableNumber: '',
    capacity: 2,
    location: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<TableFormData>>({});

  useEffect(() => {
    if (table) {
      setFormData({
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        location: table.location || '',
        isActive: table.isActive,
      });
    } else {
      setFormData({
        tableNumber: '',
        capacity: 2,
        location: '',
        isActive: true,
      });
    }
    setErrors({});
  }, [table, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<TableFormData> = {};

    // Table number validation: 1-20 characters (matches backend)
    if (!formData.tableNumber.trim()) {
      newErrors.tableNumber = 'Table number is required';
    } else if (formData.tableNumber.trim().length > 20) {
      newErrors.tableNumber = 'Table number must not exceed 20 characters';
    }

    // Capacity validation: 1-20 (matches backend)
    if (formData.capacity < 1) {
      (newErrors as any).capacity = 'Capacity must be at least 1';
    } else if (formData.capacity > 20) {
      (newErrors as any).capacity = 'Capacity must not exceed 20';
    }

    // Location validation: max 100 characters (matches backend)
    if (formData.location && formData.location.length > 100) {
      newErrors.location = 'Location must not exceed 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  const capacityOptions = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} ${i === 0 ? 'person' : 'people'}`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={table ? 'Edit Table' : 'Add New Table'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          <Input
            label="Table Number"
            type="text"
            value={formData.tableNumber}
            onChange={(e) =>
              setFormData({ ...formData, tableNumber: e.target.value })
            }
            error={errors.tableNumber}
            placeholder="e.g., 1, A1, VIP-1"
            required
          />

          <Select
            label="Capacity"
            value={String(formData.capacity)}
            onChange={(e) =>
              setFormData({ ...formData, capacity: Number(e.target.value) })
            }
            options={capacityOptions}
            error={errors.capacity ? String(errors.capacity) : undefined}
            required
          />

          <Input
            label="Location (Optional)"
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="e.g., Main Hall, Patio, Window Side"
          />

          <Select
            label="Status"
            value={formData.isActive ? 'true' : 'false'}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.value === 'true' })
            }
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {table ? 'Update Table' : 'Create Table'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default TableForm;
