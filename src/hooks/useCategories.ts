import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface DbCategoryInsert {
  name: string;
  slug: string;
  parent_id?: string | null;
  description?: string | null;
  image_url?: string | null;
  is_active?: boolean | null;
  sort_order?: number | null;
}

export const useCategories = () => useQuery({
  queryKey: ['categories'],
  queryFn: async () => {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    return data as DbCategory[];
  },
});

export const useActiveCategories = () => useQuery({
  queryKey: ['categories', 'active'],
  queryFn: async () => {
    const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true });
    if (error) throw error;
    return data as DbCategory[];
  },
});

export const useAddCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (category: DbCategoryInsert) => {
      const { data, error } = await supabase.from('categories').insert(category).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbCategory> & { id: string }) => {
      const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });
};
