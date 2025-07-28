
import { FacebookIntegrationSettings } from './FacebookIntegrationSettings'

export const CampaignSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Campaign Settings</h2>
        <p className="text-muted-foreground">
          Configure your advertising platform integrations and campaign preferences
        </p>
      </div>
      
      <FacebookIntegrationSettings />
    </div>
  )
}
