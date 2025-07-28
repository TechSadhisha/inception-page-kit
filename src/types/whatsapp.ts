
export interface WhatsAppMessage {
  id: string
  prospect_id: string
  phone_number: string
  message: string
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed'
  sent_at: string | null
  delivered_at: string | null
  created_at: string
  sent_by: string
  prospect?: {
    name: string
    email: string | null
  }
}

export interface WhatsAppMessageInsert {
  prospect_id: string
  phone_number: string
  message: string
  sent_by: string
}

export interface WhatsAppTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  created_by: string
  created_at: string
}

export interface WhatsAppProvider {
  name: string
  sendMessage: (to: string, message: string) => Promise<{ success: boolean; messageId?: string; error?: string }>
  getStatus: (messageId: string) => Promise<{ status: string; error?: string }>
}
