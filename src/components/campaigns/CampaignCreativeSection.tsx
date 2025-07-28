
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit3 } from 'lucide-react'
import { CampaignImageUpload } from './CampaignImageUpload'

interface CampaignCreativeSectionProps {
  newCampaign: any
  setNewCampaign: (campaign: any) => void
}

export const CampaignCreativeSection = ({ newCampaign, setNewCampaign }: CampaignCreativeSectionProps) => {
  const handleImagesChange = (images: File[]) => {
    setNewCampaign((prev: any) => ({
      ...prev,
      images
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Edit3 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Ad Creative *</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="headline">Headline *</Label>
          <Input
            id="headline"
            value={newCampaign.headline}
            onChange={(e) => setNewCampaign({ ...newCampaign, headline: e.target.value })}
            placeholder="Your compelling headline (max 25 characters)"
            maxLength={25}
          />
          <p className="text-xs text-muted-foreground">
            {newCampaign.headline.length}/25 characters
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ad-description">Ad Description *</Label>
          <Textarea
            id="ad-description"
            value={newCampaign.adDescription}
            onChange={(e) => setNewCampaign({ ...newCampaign, adDescription: e.target.value })}
            placeholder="Describe your offer (max 125 characters)"
            maxLength={125}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            {newCampaign.adDescription.length}/125 characters
          </p>
        </div>
      </div>

      <CampaignImageUpload
        images={newCampaign.images || []}
        onImagesChange={handleImagesChange}
        maxImages={5}
      />
    </div>
  )
}
