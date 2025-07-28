
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
}

export interface ProspectUpdate {
  name?: string
  email?: string
  phone?: string
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  interest_rating?: number
  notes?: string
  assigned_to?: string
}
