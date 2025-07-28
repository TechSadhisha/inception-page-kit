
export interface Message {
  id: string;
  content: string;
  project_id: string;
  sender_id: string;
  created_at: string | null;
  sender?: {
    id: string;
    full_name: string | null;
    email: string;
  };
}
