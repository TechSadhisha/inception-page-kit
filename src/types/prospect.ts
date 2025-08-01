
export interface Prospect {
  id: string
  project_id: string
  name: string
  email: string | null
  phone: string | null
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  interest_rating: number | null
  notes: string | null
  assigned_to: string | null
  source: string | null
  lead_score: number | null
  last_contacted_at: string | null
  conversion_date: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

export interface ProspectInsert {
  project_id: string
  name: string
  email?: string
  phone?: string
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  interest_rating?: number
  notes?: string
  assigned_to?: string
  source?: string
  lead_score?: number
  last_contacted_at?: string
  conversion_date?: string
  tags?: string[]
}

export interface ProspectUpdate {
  name?: string
  email?: string
  phone?: string
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  interest_rating?: number
  notes?: string
  assigned_to?: string
  source?: string
  lead_score?: number
  last_contacted_at?: string
  conversion_date?: string
  tags?: string[]
}
