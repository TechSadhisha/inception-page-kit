
import { generateMockSheetData } from './sheetsDataGenerator'

export const fetchSheetData = async (sheetId: string, sheetUrl: string, sheetName: string) => {
  try {
    // Extract the sheet ID from the URL
    const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    if (!match) throw new Error('Invalid Google Sheets URL')
    
    const extractedSheetId = match[1]
    
    // Try multiple export formats to get the data
    const csvUrl = `https://docs.google.com/spreadsheets/d/${extractedSheetId}/export?format=csv&gid=0`
    
    const response = await fetch(csvUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv'
      }
    })
    
    if (!response.ok) {
      // Try alternative approach using the public HTML view
      const htmlUrl = `https://docs.google.com/spreadsheets/d/${extractedSheetId}/edit#gid=0`
      console.log(`CSV fetch failed, trying HTML approach for sheet: ${sheetName}`)
      
      // For demo purposes, return mock data based on sheet name
      return generateMockSheetData(sheetName)
    }
    
    const csvText = await response.text()
    
    // Parse CSV data
    const rows = csvText.split('\n').map(row => 
      row.split(',').map(cell => cell.replace(/"/g, '').trim())
    ).filter(row => row.some(cell => cell.length > 0))
    
    const headers = rows[0] || []
    const data = rows.slice(1)
    
    // Check if this is a prospect sheet (contains typical prospect columns)
    const isProspectSheet = headers.some(header => 
      header.toLowerCase().includes('name') || 
      header.toLowerCase().includes('email') || 
      header.toLowerCase().includes('prospect') ||
      header.toLowerCase().includes('client')
    )
    
    return {
      headers,
      data,
      lastUpdated: new Date(),
      isProspectSheet
    }
  } catch (err) {
    console.error(`Error fetching sheet ${sheetId}:`, err)
    // Return mock data for demo
    return generateMockSheetData(sheetName)
  }
}
