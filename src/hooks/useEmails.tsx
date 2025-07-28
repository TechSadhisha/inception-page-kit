
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Email {
  id: string;
  gmail_message_id: string;
  thread_id: string | null;
  subject: string | null;
  sender: string | null;
  recipient: string | null;
  body_text: string | null;
  body_html: string | null;
  received_date: string | null;
  is_read: boolean;
  labels: string[];
  created_at: string;
  updated_at: string;
}

export interface GmailSyncStatus {
  id: string;
  last_sync_at: string | null;
  sync_token: string | null;
  is_enabled: boolean;
}

export const useEmails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch emails
  const { data: emails, isLoading: emailsLoading } = useQuery({
    queryKey: ['emails', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('received_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Email[];
    },
    enabled: !!user?.id,
  });

  // Fetch sync status - fix the query to handle no records
  const { data: syncStatus } = useQuery({
    queryKey: ['gmail-sync-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('gmail_sync_status')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as GmailSyncStatus | null;
    },
    enabled: !!user?.id,
  });

  // Sync emails mutation
  const syncEmailsMutation = useMutation({
    mutationFn: async (accessToken: string) => {
      const { data, error } = await supabase.functions.invoke('gmail-sync', {
        body: { 
          accessToken,
          syncToken: syncStatus?.sync_token,
          maxResults: 25 
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['gmail-sync-status'] });
      toast({
        title: "Emails Synced",
        description: "Successfully synced your emails from Gmail",
      });
    },
    onError: (error: any) => {
      console.error('Gmail sync error:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync emails",
        variant: "destructive",
      });
    },
  });

  // Mark email as read
  const markAsReadMutation = useMutation({
    mutationFn: async (emailId: string) => {
      const { error } = await supabase
        .from('emails')
        .update({ is_read: true })
        .eq('id', emailId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });

  // Delete email
  const deleteEmailMutation = useMutation({
    mutationFn: async (emailId: string) => {
      const { error } = await supabase
        .from('emails')
        .delete()
        .eq('id', emailId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast({
        title: "Email Deleted",
        description: "Email has been deleted successfully",
      });
    },
  });

  return {
    emails: emails || [],
    emailsLoading,
    syncStatus,
    syncEmails: syncEmailsMutation.mutate,
    isSyncing: syncEmailsMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
    deleteEmail: deleteEmailMutation.mutate,
  };
};
