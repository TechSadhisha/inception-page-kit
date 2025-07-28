
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export type AppRole = 'admin' | 'manager' | 'staff';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_by: string | null;
  assigned_at: string;
}

export const useUserRoles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user's role - simplified without strict checks
  const { data: currentUserRole, isLoading: roleLoading } = useQuery({
    queryKey: ['current-user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .rpc('get_user_role', { _user_id: user.id });
        
        if (error) {
          console.error('Error fetching user role:', error);
          return null;
        }
        
        return data as AppRole | null;
      } catch (err) {
        console.error('Unexpected error fetching user role:', err);
        return null;
      }
    },
    enabled: !!user?.id,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Get all user roles - simplified query
  const { data: allUserRoles, isLoading: allRolesLoading } = useQuery({
    queryKey: ['all-user-roles'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select(`
            *,
            profiles!user_roles_user_id_fkey(full_name, email)
          `);
        
        if (error) {
          console.error('Error fetching all roles:', error);
          return [];
        }
        
        return data || [];
      } catch (err) {
        console.error('Unexpected error fetching all roles:', err);
        return [];
      }
    },
    enabled: !!user?.id,
    retry: 1,
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role, 
          assigned_by: user?.id 
        }, {
          onConflict: 'user_id,role'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
      toast({
        title: "Role assigned successfully",
        description: "User role has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error assigning role",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove role mutation
  const removeRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-user-roles'] });
      toast({
        title: "Role removed successfully",
        description: "User role has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing role",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Simplified role checking functions - all return true for now to remove restrictions
  const hasRole = (role: AppRole): boolean => {
    return true; // Simplified - no restrictions
  };

  const canManageProjects = (): boolean => {
    return true; // All users can manage projects
  };

  const isAdmin = (): boolean => {
    return true; // All users have admin access for now
  };

  return {
    currentUserRole,
    allUserRoles,
    roleLoading,
    allRolesLoading,
    assignRole: assignRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
    isAssigningRole: assignRoleMutation.isPending,
    isRemovingRole: removeRoleMutation.isPending,
    hasRole,
    canManageProjects,
    isAdmin,
  };
};
