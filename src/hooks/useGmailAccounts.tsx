import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface GmailAccount {
  id: string;
  user_id: string;
  email: string;
  client_id?: string;
  client_secret?: string;
  is_connected: boolean;
  last_sync_at?: string;
  access_token?: string;
  refresh_token?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGmailAccountData {
  email: string;
  client_id?: string;
  client_secret?: string;
}

export const useGmailAccounts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Gmail accounts
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['gmail-accounts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('gmail_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GmailAccount[];
    },
    enabled: !!user?.id,
  });

  // Add Gmail account
  const addAccountMutation = useMutation({
    mutationFn: async (accountData: CreateGmailAccountData) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('gmail_accounts')
        .insert({
          user_id: user.id,
          email: accountData.email,
          client_id: accountData.client_id,
          client_secret: accountData.client_secret,
          is_connected: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['gmail-accounts'] });
      toast({
        title: "Account Added",
        description: `Gmail account ${data.email} has been saved successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Error adding Gmail account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add Gmail account",
        variant: "destructive",
      });
    },
  });

  // Update account connection status
  const updateConnectionMutation = useMutation({
    mutationFn: async ({ 
      accountId, 
      isConnected, 
      accessToken, 
      refreshToken 
    }: { 
      accountId: string; 
      isConnected: boolean; 
      accessToken?: string; 
      refreshToken?: string; 
    }) => {
      const updateData: any = {
        is_connected: isConnected,
        last_sync_at: isConnected ? new Date().toISOString() : null,
      };

      if (accessToken) updateData.access_token = accessToken;
      if (refreshToken) updateData.refresh_token = refreshToken;
      if (!isConnected) {
        updateData.access_token = null;
        updateData.refresh_token = null;
      }

      const { data, error } = await supabase
        .from('gmail_accounts')
        .update(updateData)
        .eq('id', accountId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['gmail-accounts'] });
      toast({
        title: data.is_connected ? "Account Connected" : "Account Disconnected",
        description: data.is_connected 
          ? "Successfully connected to Gmail account." 
          : "Gmail account has been disconnected.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating connection:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update connection",
        variant: "destructive",
      });
    },
  });

  // Remove Gmail account
  const removeAccountMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase
        .from('gmail_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gmail-accounts'] });
      toast({
        title: "Account Removed",
        description: "Gmail account has been removed from your configuration.",
      });
    },
    onError: (error: any) => {
      console.error('Error removing Gmail account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove Gmail account",
        variant: "destructive",
      });
    },
  });

  return {
    accounts: accounts || [],
    isLoading,
    addAccount: addAccountMutation.mutate,
    isAddingAccount: addAccountMutation.isPending,
    updateConnection: updateConnectionMutation.mutate,
    isUpdatingConnection: updateConnectionMutation.isPending,
    removeAccount: removeAccountMutation.mutate,
    isRemovingAccount: removeAccountMutation.isPending,
  };
};