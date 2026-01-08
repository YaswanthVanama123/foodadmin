import { useState, useEffect } from 'react';
import { tablesApi } from '../api';
import { Table, TableFormData } from '../types';
import toast from 'react-hot-toast';

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tablesApi.getAll();
      setTables(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch tables';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createTable = async (data: TableFormData): Promise<void> => {
    try {
      const newTable = await tablesApi.create(data);
      setTables((prev) => [...prev, newTable]);
      toast.success('Table created successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create table';
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateTable = async (id: string, data: Partial<TableFormData>): Promise<void> => {
    try {
      const updatedTable = await tablesApi.update(id, data);
      setTables((prev) =>
        prev.map((table) => (table._id === id ? updatedTable : table))
      );
      toast.success('Table updated successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update table';
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteTable = async (id: string): Promise<void> => {
    try {
      await tablesApi.delete(id);
      setTables((prev) => prev.filter((table) => table._id !== id));
      toast.success('Table deleted successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete table';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return {
    tables,
    loading,
    error,
    fetchTables,
    createTable,
    updateTable,
    deleteTable,
  };
};
