import { useState, useEffect, useRef, useCallback } from 'react';
import { menuApi, MenuPageData } from '../api/menu.api';
import { MenuItem, Category } from '../types';

export const useMenuPageData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate API calls (React Strict Mode)
  const isFetching = useRef(false);

  const fetchData = useCallback(async () => {
    // Prevent concurrent requests
    if (isFetching.current) return;

    try {
      isFetching.current = true;
      setIsLoading(true);
      setError(null);
      const data = await menuApi.getPageData();
      setCategories(data.categories);
      setItems(data.menuItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu data');
      console.error('Error fetching menu page data:', err);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createItem = async (data: any, image?: File) => {
    try {
      // OPTIMIZED: Single API call with image included
      const newItem = await menuApi.create(data, image);
      await fetchData();
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create menu item');
      throw err;
    }
  };

  const updateItem = async (id: string, data: any, image?: File) => {
    try {
      // OPTIMIZED: Single API call with image included
      const updatedItem = await menuApi.update(id, data, image);
      await fetchData();
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu item');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await menuApi.delete(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu item');
      throw err;
    }
  };

  const toggleAvailability = async (id: string) => {
    try {
      await menuApi.toggleAvailability(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle availability');
      throw err;
    }
  };

  const createCategory = async (data: any) => {
    try {
      // Import categoriesApi only when needed
      const { categoriesApi } = await import('../api/categories.api');
      const newCategory = await categoriesApi.create(data);
      await fetchData();
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      throw err;
    }
  };

  const updateCategory = async (id: string, data: any) => {
    try {
      const { categoriesApi } = await import('../api/categories.api');
      const updatedCategory = await categoriesApi.update(id, data);
      await fetchData();
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { categoriesApi } = await import('../api/categories.api');
      await categoriesApi.delete(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      throw err;
    }
  };

  const toggleCategoryStatus = async (id: string) => {
    try {
      const { categoriesApi } = await import('../api/categories.api');
      await categoriesApi.toggleStatus(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle category status');
      throw err;
    }
  };

  return {
    categories,
    items,
    isLoading,
    error,
    refetch: fetchData,
    createItem,
    updateItem,
    deleteItem,
    toggleAvailability,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
  };
};
