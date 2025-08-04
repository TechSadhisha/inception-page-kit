
export interface FollowUp {
  id: string
  date: string
  status: 'contacted' | 'no_response' | 'meeting_scheduled' | 'callback_requested' | 'not_interested' | 'follow_up_later'
  notes?: string
}

export interface Prospect {
  id: string
  project_id: string
  name: string
  email: string | null
  phone: string | null
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'dropped' | 'lost'
  interest_rating: number | null
  notes: string | null
  assigned_to: string | null
  source: string | null
  lead_score: number | null
  last_contacted_at: string | null
  conversion_date: string | null
  tags: string[] | null
  date_added: string
  first_contact_date: string | null
  follow_ups: FollowUp[]
  created_at: string
  updated_at: string
}

export interface ProspectInsert {
  project_id: string
  name: string
  email?: string
  phone?: string
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'dropped' | 'lost'
  interest_rating?: number
  notes?: string
  assigned_to?: string
  source?: string
  lead_score?: number
  last_contacted_at?: string
  conversion_date?: string
  tags?: string[]
  date_added?: string
  first_contact_date?: string
  follow_ups?: FollowUp[]
}

export interface ProspectUpdate {
  name?: string
  email?: string
  phone?: string
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'dropped' | 'lost'
  interest_rating?: number
  notes?: string
  assigned_to?: string
  source?: string
  lead_score?: number
  last_contacted_at?: string
  conversion_date?: string
  tags?: string[]
  date_added?: string
  first_contact_date?: string
  follow_ups?: FollowUp[]
}
