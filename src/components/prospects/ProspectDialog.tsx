
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProspectForm } from './ProspectForm'
import { GoogleMapsContactScraper } from './GoogleMapsContactScraper'
import { Prospect, ProspectInsert, ProspectUpdate } from '@/types/prospect'

interface ProspectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prospect?: Prospect | null
  projectId: string
  onSubmit: (data: ProspectInsert | ProspectUpdate) => void
  isLoading: boolean
}

export const ProspectDialog = ({
  open,
  onOpenChange,
  prospect,
  projectId,
  onSubmit,
  isLoading,
}: ProspectDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new' as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost',
    interest_rating: 0,
    notes: '',
  })

  const handleScrapedContactSelect = (contact: any) => {
    setFormData({
      name: contact.name || '',
      email: '',
      phone: contact.phone || '',
      status: 'new',
      interest_rating: 0,
      notes: contact.address ? `Address: ${contact.address}${contact.website ? `\nWebsite: ${contact.website}` : ''}` : '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {prospect ? 'Edit Prospect' : 'Add New Prospect'}
          </DialogTitle>
          <DialogDescription>
            {prospect 
              ? 'Update the prospect information and rating.'
              : 'Add a new prospect manually or search Google Maps for businesses.'
            }
          </DialogDescription>
        </DialogHeader>
        
        {!prospect ? (
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="scraper">Google Maps Search</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-4">
              <ProspectForm
                prospect={prospect}
                projectId={projectId}
                onSubmit={onSubmit}
                isLoading={isLoading}
                initialData={formData}
              />
            </TabsContent>
            
            <TabsContent value="scraper" className="space-y-4">
              <GoogleMapsContactScraper
                projectId={projectId}
                onContactSelect={handleScrapedContactSelect}
              />
              
              {(formData.name || formData.phone) && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4">Selected Contact - Complete the Details:</h4>
                  <ProspectForm
                    prospect={prospect}
                    projectId={projectId}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    initialData={formData}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <ProspectForm
            prospect={prospect}
            projectId={projectId}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
