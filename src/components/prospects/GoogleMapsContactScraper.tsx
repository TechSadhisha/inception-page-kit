
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, MapPin } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ApifyService } from '@/services/apifyService'
import { ApifyCredentialsForm } from './ApifyCredentialsForm'
import { SearchParamsForm } from './SearchParamsForm'
import { ContactResults } from './ContactResults'
import { ScrapedContact, ApifyCredentials, SearchParams } from '@/types/apify'

interface GoogleMapsContactScraperProps {
  projectId: string
  onContactSelect: (contact: ScrapedContact) => void
}

export const GoogleMapsContactScraper = ({ projectId, onContactSelect }: GoogleMapsContactScraperProps) => {
  const [credentials, setCredentials] = useState<ApifyCredentials>({
    userId: '',
    token: '',
    actorName: 'compass/crawler-google-places'
  })
  
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    location: '',
    maxResults: 20
  })
  
  const [contacts, setContacts] = useState<ScrapedContact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchParams.query.trim() || !searchParams.location.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both search query and location",
        variant: "destructive",
      })
      return
    }

    if (!credentials.token.trim()) {
      toast({
        title: "Missing API Token",
        description: "Please enter your Apify API token",
        variant: "destructive",
      })
      return
    }

    if (!credentials.userId.trim()) {
      toast({
        title: "Missing User ID",
        description: "Please enter your Apify User ID",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log('Searching Google Maps via Apify for:', searchParams)
      const results = await ApifyService.scrapeGoogleMaps(credentials, searchParams)
      setContacts(results)
      
      toast({
        title: "Search Complete",
        description: `Found ${results.length} potential contacts`,
      })
    } catch (error) {
      console.error('Error scraping Google Maps:', error)
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Failed to scrape Google Maps. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddContact = (contact: ScrapedContact) => {
    onContactSelect(contact)
    toast({
      title: "Contact Selected",
      description: `${contact.name} has been selected for adding as a prospect`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Google Maps Contact Scraper (Apify)
          </CardTitle>
          <CardDescription>
            Search for businesses on Google Maps and extract their contact information using Apify
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ApifyCredentialsForm 
            credentials={credentials}
            onCredentialsChange={setCredentials}
          />

          <SearchParamsForm 
            params={searchParams}
            onParamsChange={setSearchParams}
          />

          <Button 
            onClick={handleSearch} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping Google Maps... This may take a few minutes
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Search Google Maps
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <ContactResults 
        contacts={contacts}
        onContactSelect={handleAddContact}
      />
    </div>
  )
}
