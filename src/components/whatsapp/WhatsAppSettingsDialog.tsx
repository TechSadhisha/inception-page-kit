
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info, ExternalLink } from 'lucide-react'

interface WhatsAppSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const WhatsAppSettingsDialog = ({ open, onOpenChange }: WhatsAppSettingsDialogProps) => {
  const [watiApiToken, setWatiApiToken] = useState('')
  const [watiApiUrl, setWatiApiUrl] = useState('')
  const [whatsAppNumber, setWhatsAppNumber] = useState('')

  const handleSaveSettings = () => {
    // TODO: Implement saving settings to Supabase secrets
    console.log('Saving WATI WhatsApp settings:', {
      watiApiToken,
      watiApiUrl,
      whatsAppNumber
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>WhatsApp Settings - WATI Integration</DialogTitle>
          <DialogDescription>
            Configure your WATI (WhatsApp Team Inbox) credentials to start sending WhatsApp messages
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              WATI is perfect for Indian businesses and provides reliable WhatsApp Business API integration.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>WATI Configuration</CardTitle>
              <CardDescription>
                Enter your WATI API credentials to enable WhatsApp messaging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-token">API Token</Label>
                <Input
                  id="api-token"
                  type="password"
                  placeholder="Enter your WATI API Token"
                  value={watiApiToken}
                  onChange={(e) => setWatiApiToken(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-url">API URL</Label>
                <Input
                  id="api-url"
                  type="text"
                  placeholder="https://live-server-xxxx.wati.io"
                  value={watiApiUrl}
                  onChange={(e) => setWatiApiUrl(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Your WATI instance URL (found in your WATI dashboard)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-number">WhatsApp Business Number</Label>
                <Input
                  id="whatsapp-number"
                  type="text"
                  placeholder="+91XXXXXXXXXX"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Your WhatsApp Business number (include country code +91 for India)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WATI Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p><strong>1. Create a WATI Account</strong></p>
                <p className="text-muted-foreground ml-4">
                  Sign up at{' '}
                  <a 
                    href="https://www.wati.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    wati.io <ExternalLink className="h-3 w-3" />
                  </a>
                </p>

                <p><strong>2. Connect Your WhatsApp Business Number</strong></p>
                <p className="text-muted-foreground ml-4">
                  Follow WATI's setup process to connect your Indian WhatsApp Business number
                </p>

                <p><strong>3. Get Your API Credentials</strong></p>
                <p className="text-muted-foreground ml-4">
                  Go to Settings → API → Generate your API Token and copy your API URL
                </p>

                <p><strong>4. WhatsApp Business Verification</strong></p>
                <p className="text-muted-foreground ml-4">
                  Complete Meta's WhatsApp Business verification process (required for Indian numbers)
                </p>

                <p><strong>5. Test Your Integration</strong></p>
                <p className="text-muted-foreground ml-4">
                  Send a test message to verify everything is working correctly
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefits of WATI for Indian Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Designed specifically for Indian market</li>
                  <li>Easy WhatsApp Business API setup</li>
                  <li>Support for Indian phone numbers</li>
                  <li>Local support and documentation</li>
                  <li>Competitive pricing for Indian businesses</li>
                  <li>Built-in broadcast and automation features</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save WATI Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
