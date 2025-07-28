
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { WhatsAppMessage, WhatsAppMessageInsert } from '@/types/whatsapp'
import { useToast } from '@/hooks/use-toast'

export const useWhatsApp = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch WhatsApp messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['whatsapp-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select(`
          *,
          prospects!inner(name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform the data to match our WhatsAppMessage type
      return data.map(item => ({
        ...item,
        prospect: {
          name: item.prospects.name,
          email: item.prospects.email
        }
      })) as WhatsAppMessage[]
    },
    enabled: !!user,
  })

  // Send WhatsApp message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: WhatsAppMessageInsert) => {
      // First, save to database
      const { data: savedMessage, error: dbError } = await supabase
        .from('whatsapp_messages')
        .insert([messageData])
        .select()
        .single()

      if (dbError) throw dbError

      // Then, send via WhatsApp API (using edge function)
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: messageData.phone_number,
          message: messageData.message,
          messageId: savedMessage.id
        }
      })

      if (error) throw error
      return { savedMessage, apiResponse: data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-messages'] })
      toast({
        title: "Success",
        description: "WhatsApp message sent successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send WhatsApp message",
        variant: "destructive",
      })
      console.error('Error sending WhatsApp message:', error)
    },
  })

  const sendMessage = (messageData: WhatsAppMessageInsert) => {
    sendMessageMutation.mutate(messageData)
  }

  return {
    messages: messages || [],
    isLoading,
    sendMessage,
    isSending: sendMessageMutation.isPending,
  }
}
