import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Mail, Phone, MessageCircle } from 'lucide-react'
import { RatingStars } from './RatingStars'
import { Prospect } from '@/types/prospect'

interface ProspectCardProps {
  prospect: Prospect
  onEdit: (prospect: Prospect) => void
  onDelete: (id: string) => void
  onWhatsApp?: () => void
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  converted: 'bg-purple-100 text-purple-800',
  lost: 'bg-red-100 text-red-800',
}

export const ProspectCard = ({ prospect, onEdit, onDelete, onWhatsApp }: ProspectCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg">{prospect.name}</CardTitle>
          <Badge className={statusColors[prospect.status]}>
            {prospect.status.charAt(0).toUpperCase() + prospect.status.slice(1)}
          </Badge>
        </div>
        <div className="flex space-x-1">
          {onWhatsApp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onWhatsApp}
              title="Send WhatsApp message"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(prospect)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(prospect.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {prospect.email && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{prospect.email}</span>
            </div>
          )}
          {prospect.phone && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{prospect.phone}</span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-sm font-medium">Interest Rating:</span>
          <RatingStars rating={prospect.interest_rating} readonly />
        </div>

        {prospect.notes && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Notes:</span>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {prospect.notes}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Created: {new Date(prospect.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
}
