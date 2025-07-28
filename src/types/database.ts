
export interface Project {
  id: string
  name: string
  description: string | null
  status: 'planning' | 'active' | 'completed' | 'on_hold'
  created_by: string
  created_at: string
  updated_at: string
}

export interface ProjectInsert {
  name: string
  description?: string
  status?: 'planning' | 'active' | 'completed' | 'on_hold'
  created_by: string
}

export interface ProjectUpdate {
  name?: string
  description?: string
  status?: 'planning' | 'active' | 'completed' | 'on_hold'
}

export interface Script {
  id: string
  project_id: string
  created_by: string
  title: string
  content: string
  type: 'presentation' | 'video' | 'audio' | 'document'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ScriptInsert {
  project_id: string
  title: string
  content: string
  type: 'presentation' | 'video' | 'audio' | 'document'
  notes?: string
}

export interface ScriptUpdate {
  title?: string
  content?: string
  type?: 'presentation' | 'video' | 'audio' | 'document'
  notes?: string
}
