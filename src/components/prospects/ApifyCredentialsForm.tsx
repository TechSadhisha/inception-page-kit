
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { ApifyCredentials } from '@/types/apify'

interface ApifyCredentialsFormProps {
  credentials: ApifyCredentials
  onCredentialsChange: (credentials: ApifyCredentials) => void
}

export const ApifyCredentialsForm = ({ credentials, onCredentialsChange }: ApifyCredentialsFormProps) => {
  const handleChange = (field: keyof ApifyCredentials, value: string) => {
    onCredentialsChange({
      ...credentials,
      [field]: value
    })
  }

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You need Apify credentials to use this feature. Get them from{' '}
          <a 
            href="https://console.apify.com/account/integrations" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Apify Console
          </a>. Make sure you have access to a Google Maps scraper actor.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="apify-user-id">Apify User ID</Label>
          <Input
            id="apify-user-id"
            value={credentials.userId}
            onChange={(e) => handleChange('userId', e.target.value)}
            placeholder="Enter your Apify User ID"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apify-token">Apify API Token</Label>
          <Input
            id="apify-token"
            type="password"
            value={credentials.token}
            onChange={(e) => handleChange('token', e.target.value)}
            placeholder="Enter your Apify API token"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actor-name">Actor Name</Label>
          <Select value={credentials.actorName} onValueChange={(value) => handleChange('actorName', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select actor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compass/crawler-google-places">compass/crawler-google-places</SelectItem>
              <SelectItem value="amazonbipin/google-maps-scraper-task">amazonbipin/google-maps-scraper-task</SelectItem>
              <SelectItem value="google-maps-scraper">google-maps-scraper</SelectItem>
              <SelectItem value="google-maps-reviews-scraper">google-maps-reviews-scraper</SelectItem>
              <SelectItem value="google-places-scraper">google-places-scraper</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
