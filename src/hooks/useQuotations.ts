import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Quotation {
  id: string;
  customer_name: string;
  customer_email: string;
  company_name: string;
  company_reg_no: string;
  company_address: string;
  contact_number: string;
  message: string;
  cart_items: any[];
  cart_total: number;
  status: 'pending' | 'viewed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useQuotations = () => {
  return useQuery({
    queryKey: ['quotations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quotations' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching quotations:', error);
        return [];
      }
      return data as Quotation[];
    },
  });
};

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newQuotation: Omit<Quotation, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('quotations' as any)
        .insert([{ ...newQuotation, status: 'pending' }]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
};

export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Quotation> & { id: string }) => {
      const { error } = await supabase
        .from('quotations' as any)
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
};

export const useDeleteQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('quotations' as any)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
};
