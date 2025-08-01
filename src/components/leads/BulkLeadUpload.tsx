import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import * as XLSX from 'xlsx'

interface BulkLeadUploadProps {
  projectId?: string
  onUpload: (leads: any[]) => void
  open?: boolean
  onClose?: () => void
}

export function BulkLeadUpload({ projectId, onUpload, open = false, onClose }: BulkLeadUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const downloadTemplate = () => {
    const template = [
      ['Name', 'Email', 'Phone', 'Status', 'Interest Rating (1-5)', 'Notes', 'Source'],
      ['John Doe', 'john@example.com', '+1234567890', 'new', '4', 'Interested in 2BHK', 'Website'],
      ['Jane Smith', 'jane@example.com', '+0987654321', 'new', '3', 'Looking for investment', 'Facebook']
    ]

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(template)
    XLSX.utils.book_append_sheet(wb, ws, 'Lead Template')
    XLSX.writeFile(wb, 'lead_upload_template.xlsx')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls']
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'))
    
    if (!validTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV, XLS, or XLSX file.",
        variant: "destructive"
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
        const data = e.target?.result
        let workbook: XLSX.WorkBook

        if (file.name.toLowerCase().endsWith('.csv')) {
          workbook = XLSX.read(data, { type: 'binary' })
        } else {
          workbook = XLSX.read(data, { type: 'array' })
        }

        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length < 2) {
          setErrors(['File must contain headers and at least one data row'])
          return
        }

        const headers = jsonData[0] as string[]
        const rows = jsonData.slice(1) as any[]

        // Map data to lead objects
        const leads = rows.map((row, index) => {
          const lead: any = { rowIndex: index + 2 } // +2 for header and 0-based index
          
          headers.forEach((header, colIndex) => {
            const value = row[colIndex]
            const normalizedHeader = header.toLowerCase().trim()
            
            if (normalizedHeader.includes('name')) {
              lead.name = value || ''
            } else if (normalizedHeader.includes('email')) {
              lead.email = value || ''
            } else if (normalizedHeader.includes('phone')) {
              lead.phone = value || ''
            } else if (normalizedHeader.includes('status')) {
              lead.status = value || 'new'
            } else if (normalizedHeader.includes('interest') || normalizedHeader.includes('rating')) {
              lead.interest_rating = parseInt(value) || null
            } else if (normalizedHeader.includes('note')) {
              lead.notes = value || ''
            } else if (normalizedHeader.includes('source')) {
              lead.source = value || 'Upload'
            }
          })

          return lead
        }).filter(lead => lead.name) // Filter out rows without names

        // Validate data
        const validationErrors: string[] = []
        leads.forEach(lead => {
          if (!lead.name) {
            validationErrors.push(`Row ${lead.rowIndex}: Name is required`)
          }
          if (lead.email && !isValidEmail(lead.email)) {
            validationErrors.push(`Row ${lead.rowIndex}: Invalid email format`)
          }
          if (lead.interest_rating && (lead.interest_rating < 1 || lead.interest_rating > 5)) {
            validationErrors.push(`Row ${lead.rowIndex}: Interest rating must be between 1-5`)
          }
        })

        setErrors(validationErrors)
        setPreviewData(leads.slice(0, 10)) // Show first 10 for preview
        
      } catch (error) {
        console.error('Error parsing file:', error)
        setErrors(['Error parsing file. Please check the format and try again.'])
      }
    }

    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsBinaryString(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleUpload = async () => {
    if (!file || errors.length > 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Remove rowIndex from data before upload
      const cleanedData = previewData.map(({ rowIndex, ...lead }) => lead)
      
      await onUpload(cleanedData)
      
      setUploadProgress(100)
      
      toast({
        title: "Success",
        description: `Successfully uploaded ${cleanedData.length} leads`,
      })

      // Reset form
      setFile(null)
      setPreviewData([])
      setErrors([])
      
      if (onClose) onClose()
      
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading the leads. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const content = (
    <div className="space-y-6">
      {/* Download Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Download our template to ensure your data is in the correct format.
          </p>
          <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Download Template
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Leads File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="lead-file">Select File (CSV, XLS, XLSX)</Label>
            <Input
              id="lead-file"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading leads...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Found {errors.length} error(s):</div>
            <ul className="list-disc list-inside space-y-1">
              {errors.slice(0, 5).map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
              {errors.length > 5 && (
                <li className="text-sm">... and {errors.length - 5} more errors</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Preview */}
      {previewData.length > 0 && errors.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Preview ({previewData.length} leads ready to upload)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border max-h-64 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((lead, index) => (
                    <TableRow key={index}>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.email || '-'}</TableCell>
                      <TableCell>{lead.phone || '-'}</TableCell>
                      <TableCell>{lead.status || 'new'}</TableCell>
                      <TableCell>{lead.source || 'Upload'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                onClick={handleUpload} 
                disabled={isUploading || errors.length > 0}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload {previewData.length} Leads
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  if (open && onClose) {
    return (
      <Dialog open={open} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Lead Upload</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return content
}