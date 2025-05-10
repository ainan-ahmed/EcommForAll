import { useQuery } from '@tanstack/react-query';
import { fetchCategoryBySlug } from '../api/categoryApi';
import { Category } from '../types';


export function useCategory(slug: string) {
  return useQuery<Category>({
    queryKey: ['category', slug],
    queryFn:  () => fetchCategoryBySlug(slug),
  });
}