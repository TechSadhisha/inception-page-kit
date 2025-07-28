
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Plus, Settings } from 'lucide-react'
import { WhatsAppMessageDialog } from '@/components/whatsapp/WhatsAppMessageDialog'
import { WhatsAppMessageList } from '@/components/whatsapp/WhatsAppMessageList'
import { WhatsAppSettingsDialog } from '@/components/whatsapp/WhatsAppSettingsDialog'
import { BulkWhatsAppImport } from '@/components/whatsapp/BulkWhatsAppImport'
import { useProspects } from '@/hooks/useProspects'

const WhatsApp = () => {
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const { prospects } = useProspects()

  const prospectsWithPhone = prospects.filter(p => p.phone)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="h-8 w-8" />
            WhatsApp Messages - WATI Integration
          </h1>
          <p className="text-muted-foreground">
            Send WhatsApp messages to your prospects using WATI (WhatsApp Team Inbox) - Perfect for Indian businesses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSettingsDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            WATI Settings
          </Button>
          <Button 
            onClick={() => setMessageDialogOpen(true)}
            disabled={prospectsWithPhone.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </div>
      </div>

      {prospectsWithPhone.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Prospects with Phone Numbers</CardTitle>
            <CardDescription>
              You need to add phone numbers to your prospects before you can send WhatsApp messages.
              Go to the Prospects page and add phone numbers to your contacts.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>WATI Setup Required</CardTitle>
              <CardDescription>
                To send WhatsApp messages, you need to configure WATI (WhatsApp Team Inbox) - the perfect solution for Indian businesses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Steps to get started with WATI:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Create a WATI account at wati.io</li>
                  <li>Connect your Indian WhatsApp Business number</li>
                  <li>Get your WATI API credentials from the dashboard</li>
                  <li>Configure the credentials in WATI Settings</li>
                  <li>Start sending messages to your prospects</li>
                </ol>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">Why WATI for Indian Businesses?</p>
                  <ul className="list-disc list-inside mt-2 text-blue-700">
                    <li>Easy setup with Indian phone numbers</li>
                    <li>WhatsApp Business API compliance</li>
                    <li>Local support and documentation</li>
                    <li>Affordable pricing for Indian market</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <BulkWhatsAppImport prospects={prospectsWithPhone} />

          <WhatsAppMessageList />
        </>
      )}

      <WhatsAppMessageDialog
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
        prospects={prospectsWithPhone}
      />

      <WhatsAppSettingsDialog
        open={settingsDialogOpen}
        onOpenChange={setSettingsDialogOpen}
      />
    </div>
  )
}

export default WhatsApp
