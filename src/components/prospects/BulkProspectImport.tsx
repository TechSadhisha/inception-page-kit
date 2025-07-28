
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Download, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'
import { useToast } from '@/hooks/use-toast'

interface BulkProspectImportProps {
  projectId: string
  onImport: (prospects: any[]) => void
  isLoading: boolean
}

export const BulkProspectImport = ({ projectId, onImport, isLoading }: BulkProspectImportProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please select an Excel (.xlsx, .xls) or CSV file",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    parseFile(selectedFile)
  }

  const parseFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length < 2) {
          setErrors(['File must contain at least a header row and one data row'])
          return
        }

        const headers = jsonData[0] as string[]
        const rows = jsonData.slice(1) as any[][]

        // Map the data to prospect format
        const prospects = rows
          .filter(row => row.some(cell => cell !== undefined && cell !== ''))
          .map((row, index) => {
            const prospect: any = { project_id: projectId }
            
            headers.forEach((header, headerIndex) => {
              const value = row[headerIndex]
              const normalizedHeader = header.toLowerCase().trim()
              
              if (normalizedHeader.includes('name')) {
                prospect.name = value || ''
              } else if (normalizedHeader.includes('email')) {
                prospect.email = value || null
              } else if (normalizedHeader.includes('phone')) {
                prospect.phone = value || null
              } else if (normalizedHeader.includes('status')) {
                const status = value?.toLowerCase()
                if (['new', 'contacted', 'qualified', 'converted', 'lost'].includes(status)) {
                  prospect.status = status
                } else {
                  prospect.status = 'new'
                }
              } else if (normalizedHeader.includes('interest') || normalizedHeader.includes('rating')) {
                const rating = parseInt(value)
                if (rating >= 1 && rating <= 5) {
                  prospect.interest_rating = rating
                }
              } else if (normalizedHeader.includes('note')) {
                prospect.notes = value || null
              }
            })

            return { ...prospect, rowIndex: index + 2 }
          })

        // Validate prospects
        const validationErrors: string[] = []
        prospects.forEach((prospect, index) => {
          if (!prospect.name || prospect.name.trim() === '') {
            validationErrors.push(`Row ${prospect.rowIndex}: Name is required`)
          }
          if (prospect.email && !prospect.email.includes('@')) {
            validationErrors.push(`Row ${prospect.rowIndex}: Invalid email format`)
          }
        })

        setErrors(validationErrors)
        setPreviewData(prospects.slice(0, 10)) // Show first 10 for preview
        
        console.log('Parsed prospects:', prospects)
      } catch (error) {
        console.error('Error parsing file:', error)
        setErrors(['Error parsing file. Please check the file format.'])
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleImport = () => {
    if (previewData.length === 0) return
    
    // Remove rowIndex before importing
    const prospectsToImport = previewData.map(({ rowIndex, ...prospect }) => prospect)
    onImport(prospectsToImport)
  }

  const downloadTemplate = () => {
    const template = [
      ['Name', 'Email', 'Phone', 'Status', 'Interest Rating', 'Notes'],
      ['John Doe', 'john@example.com', '123-456-7890', 'new', '4', 'Interested in our services'],
      ['Jane Smith', 'jane@example.com', '098-765-4321', 'contacted', '5', 'Very interested, follow up next week']
    ]
    
    const ws = XLSX.utils.aoa_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Prospects Template')
    XLSX.writeFile(wb, 'prospects_template.xlsx')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Bulk Import Prospects
        </CardTitle>
        <CardDescription>
          Upload an Excel or CSV file to import multiple prospects at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <span className="text-sm text-muted-foreground">
            Use this template to format your data correctly
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excel-file">Upload File</Label>
          <Input
            id="excel-file"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground">
            Supported formats: Excel (.xlsx, .xls) and CSV files
          </p>
        </div>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {previewData.length > 0 && errors.length === 0 && (
          <div className="space-y-2">
            <Label>Preview (First 10 records)</Label>
            <div className="border rounded-lg p-3 bg-muted/50 max-h-60 overflow-auto">
              <div className="space-y-2">
                {previewData.map((prospect, index) => (
                  <div key={index} className="text-sm">
                    <strong>{prospect.name}</strong>
                    {prospect.email && <span className="ml-2 text-muted-foreground">({prospect.email})</span>}
                    {prospect.phone && <span className="ml-2 text-muted-foreground">{prospect.phone}</span>}
                    {prospect.status && <span className="ml-2 badge badge-outline">{prospect.status}</span>}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Ready to import {previewData.length} prospect(s)
            </p>
          </div>
        )}

        {file && previewData.length > 0 && errors.length === 0 && (
          <Button 
            onClick={handleImport} 
            disabled={isLoading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isLoading ? 'Importing...' : `Import ${previewData.length} Prospects`}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
