
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { BasicCampaignDetails } from './BasicCampaignDetails'
import { CampaignCreativeSection } from './CampaignCreativeSection'
import { LocationTargeting } from './LocationTargeting'
import { AudienceTargeting } from './AudienceTargeting'
import { usePublishCampaign } from '@/hooks/usePublishCampaign'
import { Loader2, Upload } from 'lucide-react'

interface CampaignFormProps {
  newCampaign: any
  setNewCampaign: (campaign: any) => void
  onSubmit: () => void
  onCancel: () => void
}

export const CampaignForm = ({ newCampaign, setNewCampaign, onSubmit, onCancel }: CampaignFormProps) => {
  const { publishToMeta, isPublishing } = usePublishCampaign()

  const handlePublishToMeta = async () => {
    // Validate required fields for Meta publishing
    if (!newCampaign.name || !newCampaign.budget || !newCampaign.objective || 
        !newCampaign.headline || !newCampaign.adDescription) {
      return
    }

    if (newCampaign.locations.length === 0) {
      return
    }

    if (newCampaign.images.length === 0) {
      return
    }

    const result = await publishToMeta({
      name: newCampaign.name,
      platform: newCampaign.platform,
      budget: parseInt(newCampaign.budget),
      objective: newCampaign.objective,
      locations: newCampaign.locations,
      ageMin: newCampaign.ageMin,
      ageMax: newCampaign.ageMax,
      interests: newCampaign.interests,
      gender: newCampaign.gender,
      headline: newCampaign.headline,
      adDescription: newCampaign.adDescription,
      images: newCampaign.images
    })

    if (result.success) {
      // Also save locally
      onSubmit()
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Campaign Details */}
      <BasicCampaignDetails 
        newCampaign={newCampaign}
        setNewCampaign={setNewCampaign}
      />

      <Separator />

      {/* Ad Creative Section */}
      <CampaignCreativeSection 
        newCampaign={newCampaign}
        setNewCampaign={setNewCampaign}
      />

      <Separator />

      {/* Location Targeting */}
      <LocationTargeting 
        newCampaign={newCampaign}
        setNewCampaign={setNewCampaign}
      />

      <Separator />

      {/* Audience Targeting */}
      <AudienceTargeting 
        newCampaign={newCampaign}
        setNewCampaign={setNewCampaign}
      />

      <Separator />

      {/* Campaign Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Campaign Notes</Label>
        <Textarea
          id="description"
          value={newCampaign.description}
          onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
          placeholder="Internal notes about your campaign strategy and goals"
          rows={3}
        />
      </div>

      <div className="flex flex-col space-y-3 pt-4">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Save Draft
          </Button>
          <Button onClick={handlePublishToMeta} disabled={isPublishing} className="bg-blue-600 hover:bg-blue-700">
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Publish to Meta
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-right">
          * Campaigns published to Meta will be created in "Paused" status for your review
        </p>
      </div>
    </div>
  )
}
