
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, ExternalLink, Plus } from 'lucide-react'
import { ScrapedContact } from '@/types/apify'

interface ContactResultsProps {
  contacts: ScrapedContact[]
  onContactSelect: (contact: ScrapedContact) => void
}

export const ContactResults = ({ contacts, onContactSelect }: ContactResultsProps) => {
  if (contacts.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Found Contacts ({contacts.length})</h3>
      <div className="grid gap-4">
        {contacts.map((contact, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{contact.name}</h4>
                  {contact.category && (
                    <Badge variant="secondary" className="mt-1">
                      {contact.category}
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => onContactSelect(contact)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                {contact.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{contact.address}</span>
                  </div>
                )}
                
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{contact.phone}</span>
                  </div>
                )}

                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{contact.email}</span>
                  </div>
                )}
                
                {contact.website && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <a 
                      href={contact.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {contact.website}
                    </a>
                  </div>
                )}

                {contact.rating && contact.reviews && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">★ {contact.rating}</span>
                    <span>({contact.reviews} reviews)</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
