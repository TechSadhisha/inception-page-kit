
export interface Email {
  id: string;
  user_id: string;
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
  user_id: string;
  last_sync_at: string | null;
  sync_token: string | null;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}
