import { useState, useEffect, useCallback, useRef } from 'react';
import { menuApi } from '../api/menu.api';
import { MenuItem, MenuFilters } from '../types';

export const useMenu = (filters?: MenuFilters) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  const fetchItems = useCallback(async () => {
    // Prevent concurrent requests
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setIsLoading(true);
      setError(null);
      const data = await menuApi.getAll(filters);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
      console.error('Error fetching menu items:', err);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const createItem = async (data: any, image?: File) => {
    try {
      const newItem = await menuApi.create(data);

      // Upload image if provided
      if (image && newItem._id) {
        const formData = new FormData();
        formData.append('image', image);
        await menuApi.uploadImage(newItem._id, formData);
      }

      await fetchItems();
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create menu item');
      throw err;
    }
  };

  const updateItem = async (id: string, data: any, image?: File) => {
    try {
      const updatedItem = await menuApi.update(id, data);

      // Upload image if provided
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        await menuApi.uploadImage(id, formData);
      }

      await fetchItems();
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu item');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await menuApi.delete(id);
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu item');
      throw err;
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      await menuApi.toggleAvailability(id);
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle availability');
      throw err;
    }
  };

  return {
    items,
    isLoading,
    error,
    refetch: fetchItems,
    createItem,
    updateItem,
    deleteItem,
    toggleAvailability,
  };
};
