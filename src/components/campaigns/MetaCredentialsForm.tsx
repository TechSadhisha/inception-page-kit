
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface MetaCredentialsFormProps {
  settings: {
    metaAppId: string
    metaAppSecret: string
    adAccountId: string
    accessToken: string
  }
  onSettingsChange: (settings: any) => void
}

export const MetaCredentialsForm = ({ settings, onSettingsChange }: MetaCredentialsFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="meta-app-id">Meta App ID</Label>
        <Input
          id="meta-app-id"
          value={settings.metaAppId}
          onChange={(e) => onSettingsChange(prev => ({ ...prev, metaAppId: e.target.value }))}
          placeholder="Enter your Meta App ID"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="meta-app-secret">Meta App Secret</Label>
        <Input
          id="meta-app-secret"
          type="password"
          value={settings.metaAppSecret}
          onChange={(e) => onSettingsChange(prev => ({ ...prev, metaAppSecret: e.target.value }))}
          placeholder="Enter your Meta App Secret"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ad-account-id">Ad Account ID</Label>
        <Input
          id="ad-account-id"
          value={settings.adAccountId}
          onChange={(e) => onSettingsChange(prev => ({ ...prev, adAccountId: e.target.value }))}
          placeholder="Enter your Ad Account ID (without 'act_' prefix)"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="access-token">Access Token</Label>
        <Input
          id="access-token"
          type="password"
          value={settings.accessToken}
          onChange={(e) => onSettingsChange(prev => ({ ...prev, accessToken: e.target.value }))}
          placeholder="Enter your long-lived User Access Token"
        />
      </div>
    </div>
  )
}
