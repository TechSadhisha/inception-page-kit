
import { SheetData, ProspectClient } from '@/types/sheets'

export const extractProspectClients = (sheetsData: SheetData[]): ProspectClient[] => {
  const prospects: ProspectClient[] = []
  
  sheetsData.forEach(sheet => {
    if (sheet.isProspectSheet && sheet.data.length > 0) {
      sheet.data.forEach(row => {
        if (row.length >= 7) {
          prospects.push({
            name: row[0] || '',
            email: row[1] || '',
            phone: row[2] || '',
            status: row[3] || '',
            interestLevel: row[4] || '',
            notes: row[5] || '',
            source: row[6] || '',
            sheetName: sheet.sheetName
          })
        }
      })
    }
  })
  
  return prospects
}

export const exportProspectClients = (prospectClients: ProspectClient[]) => {
  const csvContent = [
    ['Name', 'Email', 'Phone', 'Status', 'Interest Level', 'Notes', 'Source', 'Sheet Source'],
    ...prospectClients.map(client => [
      client.name,
      client.email,
      client.phone,
      client.status,
      client.interestLevel,
      client.notes,
      client.source,
      client.sheetName
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'prospect-clients.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}
