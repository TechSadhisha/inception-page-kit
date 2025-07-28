
import { SheetData } from '@/types/sheets'

export const parseNumericData = (data: any[][], columnIndex: number) => {
  return data
    .map(row => parseFloat(row[columnIndex]))
    .filter(value => !isNaN(value))
}

export const calculateSheetMetrics = (sheetData: SheetData) => {
  if (!sheetData.data.length) return null

  const metrics: any = {
    sheetName: sheetData.sheetName,
    totalRows: sheetData.data.length,
    totalColumns: sheetData.headers.length,
    lastUpdated: sheetData.lastUpdated.toLocaleString(),
    status: 'Connected'
  }

  // Try to identify numeric columns and calculate basic stats
  sheetData.headers.forEach((header, index) => {
    const numericValues = parseNumericData(sheetData.data, index)
    if (numericValues.length > 0) {
      metrics[`${header.toLowerCase().replace(/\s+/g, '_')}_sum`] = numericValues.reduce((a, b) => a + b, 0)
      metrics[`${header.toLowerCase().replace(/\s+/g, '_')}_avg`] = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
      metrics[`${header.toLowerCase().replace(/\s+/g, '_')}_count`] = numericValues.length
    }
  })

  return metrics
}
