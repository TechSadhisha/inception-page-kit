
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BasicCampaignDetailsProps {
  newCampaign: any
  setNewCampaign: (campaign: any) => void
}

export const BasicCampaignDetails = ({ newCampaign, setNewCampaign }: BasicCampaignDetailsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="campaign-name">Campaign Name *</Label>
        <Input
          id="campaign-name"
          value={newCampaign.name}
          onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
          placeholder="Enter campaign name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="platform">Platform *</Label>
        <Select
          value={newCampaign.platform}
          onValueChange={(value) => setNewCampaign({ ...newCampaign, platform: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="facebook">Facebook Only</SelectItem>
            <SelectItem value="instagram">Instagram Only</SelectItem>
            <SelectItem value="both">Facebook & Instagram</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="budget">Budget (₹) *</Label>
        <Input
          id="budget"
          type="number"
          value={newCampaign.budget}
          onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
          placeholder="Enter budget amount"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="objective">Campaign Objective *</Label>
        <Select
          value={newCampaign.objective}
          onValueChange={(value) => setNewCampaign({ ...newCampaign, objective: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select objective" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Lead Generation">Lead Generation</SelectItem>
            <SelectItem value="Traffic">Website Traffic</SelectItem>
            <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
            <SelectItem value="Conversions">Conversions</SelectItem>
            <SelectItem value="Engagement">Engagement</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="start-date">Start Date</Label>
        <Input
          id="start-date"
          type="date"
          value={newCampaign.startDate}
          onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end-date">End Date</Label>
        <Input
          id="end-date"
          type="date"
          value={newCampaign.endDate}
          onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
        />
      </div>
    </div>
  )
}
