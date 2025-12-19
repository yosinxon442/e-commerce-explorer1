import { useQuery } from '@tanstack/react-query';
import { Product, ProductsResponse } from '@/types/product';

const API_BASE = 'https://dummyjson.com';

export const useProducts = (limit = 30, skip = 0) => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', limit, skip],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/products?limit=${limit}&skip=${skip}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },
    enabled: !!id,
  });
};

export const useSearchProducts = (query: string) => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', 'search', query],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search products');
      return response.json();
    },
    enabled: query.length > 0,
  });
};

export const useCategories = () => {
  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/products/category-list`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/products/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch products by category');
      return response.json();
    },
    enabled: !!category,
  });
};

export const addProduct = async (productData: Partial<Product>): Promise<Product> => {
  const response = await fetch(`${API_BASE}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to add product');
  return response.json();
};

export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product> => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
};

export const deleteProduct = async (id: number): Promise<Product & { isDeleted: boolean; deletedOn: string }> => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete product');
  return response.json();
};
