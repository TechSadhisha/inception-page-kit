
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Download, MessageCircle, Clock } from 'lucide-react'
import * as XLSX from 'xlsx'
import { useToast } from '@/hooks/use-toast'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { useAuth } from '@/hooks/useAuth'

interface BulkWhatsAppImportProps {
  prospects: Array<{ id: string; name: string; phone: string }>
}

interface BulkMessage {
  name: string
  phone: string
  message: string
  prospectId?: string
}

export const BulkWhatsAppImport = ({ prospects }: BulkWhatsAppImportProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<BulkMessage[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)
  const { toast } = useToast()
  const { sendMessage } = useWhatsApp()
  const { user } = useAuth()

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

        // Map the data to bulk message format
        const messages = rows
          .filter(row => row.some(cell => cell !== undefined && cell !== ''))
          .map((row, index) => {
            const message: BulkMessage = {
              name: '',
              phone: '',
              message: ''
            }
            
            headers.forEach((header, headerIndex) => {
              const value = row[headerIndex]
              const normalizedHeader = header.toLowerCase().trim()
              
              if (normalizedHeader.includes('name')) {
                message.name = value || ''
              } else if (normalizedHeader.includes('phone')) {
                message.phone = value ? String(value).replace(/\D/g, '') : ''
              } else if (normalizedHeader.includes('message')) {
                message.message = value || ''
              }
            })

            // Try to match with existing prospects
            const matchingProspect = prospects.find(p => 
              p.phone.replace(/\D/g, '') === message.phone ||
              p.name.toLowerCase() === message.name.toLowerCase()
            )
            
            if (matchingProspect) {
              message.prospectId = matchingProspect.id
              message.name = matchingProspect.name
              message.phone = matchingProspect.phone
            }

            return { ...message, rowIndex: index + 2 }
          })

        // Validate messages
        const validationErrors: string[] = []
        messages.forEach((msg, index) => {
          if (!msg.name || msg.name.trim() === '') {
            validationErrors.push(`Row ${(msg as any).rowIndex}: Name is required`)
          }
          if (!msg.phone || msg.phone.length < 10) {
            validationErrors.push(`Row ${(msg as any).rowIndex}: Valid phone number is required`)
          }
          if (!msg.message || msg.message.trim() === '') {
            validationErrors.push(`Row ${(msg as any).rowIndex}: Message is required`)
          }
        })

        setErrors(validationErrors)
        setPreviewData(messages.slice(0, 10)) // Show first 10 for preview
        
        console.log('Parsed messages:', messages)
      } catch (error) {
        console.error('Error parsing file:', error)
        setErrors(['Error parsing file. Please check the file format.'])
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleBulkSend = async () => {
    if (previewData.length === 0 || !user) return
    
    setIsProcessing(true)
    setProcessedCount(0)

    try {
      // Remove rowIndex before processing
      const messagesToSend = previewData.map(({ rowIndex, ...msg }: any) => msg)
      
      for (let i = 0; i < messagesToSend.length; i++) {
        const msg = messagesToSend[i]
        
        try {
          // Find or create prospect entry
          let prospectId = msg.prospectId
          
          if (!prospectId) {
            // For this demo, we'll skip messages without matching prospects
            // In a real implementation, you might want to create new prospects
            console.warn(`Skipping message for ${msg.name} - no matching prospect found`)
            continue
          }

          // Send the message
          sendMessage({
            prospect_id: prospectId,
            phone_number: msg.phone,
            message: msg.message,
            sent_by: user.id
          })

          setProcessedCount(i + 1)

          // Wait 1 minute between messages (except for the last one)
          if (i < messagesToSend.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 60000)) // 1 minute delay
          }
        } catch (error) {
          console.error(`Error sending message to ${msg.name}:`, error)
        }
      }

      toast({
        title: "Bulk send completed",
        description: `Processed ${messagesToSend.length} messages with 1-minute intervals`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process bulk messages",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProcessedCount(0)
    }
  }

  const downloadTemplate = () => {
    const template = [
      ['Name', 'Phone', 'Message'],
      ['John Doe', '1234567890', 'Hello John, this is a sample WhatsApp message.'],
      ['Jane Smith', '0987654321', 'Hi Jane, thank you for your interest in our services.']
    ]
    
    const ws = XLSX.utils.aoa_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'WhatsApp Messages Template')
    XLSX.writeFile(wb, 'whatsapp_bulk_template.xlsx')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Bulk WhatsApp Messages
        </CardTitle>
        <CardDescription>
          Upload an Excel or CSV file to send WhatsApp messages in bulk with 1-minute intervals
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
            Use this template to format your messages correctly
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp-file">Upload File</Label>
          <Input
            id="whatsapp-file"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          <p className="text-xs text-muted-foreground">
            Supported formats: Excel (.xlsx, .xls) and CSV files. Required columns: Name, Phone, Message
          </p>
        </div>

        {isProcessing && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <div>Processing bulk messages... ({processedCount} sent)</div>
                <div className="text-xs text-muted-foreground">
                  Please keep this page open. Messages are sent with 1-minute intervals.
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

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
                {previewData.map((msg, index) => (
                  <div key={index} className="text-sm border-b pb-2 last:border-b-0">
                    <div><strong>{msg.name}</strong> ({msg.phone})</div>
                    <div className="text-muted-foreground truncate">{msg.message}</div>
                    {msg.prospectId && (
                      <div className="text-xs text-green-600">✓ Matched with existing prospect</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Ready to send {previewData.length} message(s) with 1-minute intervals
            </p>
          </div>
        )}

        {file && previewData.length > 0 && errors.length === 0 && (
          <Button 
            onClick={handleBulkSend} 
            disabled={isProcessing}
            className="w-full"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {isProcessing ? `Sending... (${processedCount} sent)` : `Send ${previewData.length} Messages`}
          </Button>
        )}

        {isProcessing && (
          <div className="text-xs text-muted-foreground text-center">
            ⏱️ Each message is sent with a 1-minute delay to avoid rate limiting
          </div>
        )}
      </CardContent>
    </Card>
  )
}
