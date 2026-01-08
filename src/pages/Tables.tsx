import React, { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { TablesGrid, TableForm } from '../components/tables';
import Modal, { ModalBody, ModalFooter } from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useTables } from '../hooks/useTables';
import { Table, TableFormData } from '../types';

const Tables: React.FC = () => {
  const { tables, loading, createTable, updateTable, deleteTable } = useTables();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddTable = () => {
    setSelectedTable(null);
    setIsFormOpen(true);
  };

  const handleEditTable = (table: Table) => {
    setSelectedTable(table);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (table: Table) => {
    setTableToDelete(table);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tableToDelete) return;

    setIsDeleting(true);
    try {
      await deleteTable(tableToDelete._id);
      setIsDeleteModalOpen(false);
      setTableToDelete(null);
    } catch (error) {
      console.error('Failed to delete table:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: TableFormData) => {
    setIsSubmitting(true);
    try {
      if (selectedTable) {
        await updateTable(selectedTable._id, data);
      } else {
        await createTable(data);
      }
      setIsFormOpen(false);
      setSelectedTable(null);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tables"
        subtitle="Manage your restaurant tables"
        action={{
          label: 'Add Table',
          onClick: handleAddTable,
          icon: <Plus className="h-5 w-5" />,
        }}
      />

      <TablesGrid
        tables={tables}
        onEdit={handleEditTable}
        onDelete={handleDeleteClick}
      />

      <TableForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTable(null);
        }}
        onSubmit={handleFormSubmit}
        table={selectedTable}
        isLoading={isSubmitting}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTableToDelete(null);
        }}
        title="Delete Table"
        size="sm"
      >
        <ModalBody>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">
                Are you sure you want to delete Table {tableToDelete?.tableNumber}?
              </p>
              <p className="text-gray-600 text-sm mt-2">
                This action cannot be undone. The table will be permanently removed from
                your restaurant.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setTableToDelete(null);
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            isLoading={isDeleting}
          >
            Delete Table
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Tables;
