
export interface SheetData {
  sheetId: string
  sheetName: string
  projectId: string
  data: any[][]
  headers: string[]
  lastUpdated: Date
  isProspectSheet: boolean
}

export interface ProspectClient {
  name: string
  email: string
  phone: string
  status: string
  interestLevel: string
  notes: string
  source: string
  sheetName: string
}
