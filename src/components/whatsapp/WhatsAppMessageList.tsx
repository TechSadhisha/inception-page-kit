
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Clock, Check, CheckCheck, X } from 'lucide-react'
import { useWhatsApp } from '@/hooks/useWhatsApp'

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  sent: <Check className="h-4 w-4" />,
  delivered: <CheckCheck className="h-4 w-4" />,
  read: <CheckCheck className="h-4 w-4 text-blue-500" />,
  failed: <X className="h-4 w-4" />
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  sent: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  read: 'bg-purple-100 text-purple-800',
  failed: 'bg-red-100 text-red-800'
}

export const WhatsAppMessageList = () => {
  const { messages, isLoading } = useWhatsApp()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            No Messages Yet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You haven't sent any WhatsApp messages yet. Use the "Send WhatsApp" button to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {message.prospect?.name || 'Unknown Contact'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{message.phone_number}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusColors[message.status]}>
                <span className="flex items-center gap-1">
                  {statusIcons[message.status]}
                  {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Created: {new Date(message.created_at).toLocaleString()}
              </span>
              {message.sent_at && (
                <span>
                  Sent: {new Date(message.sent_at).toLocaleString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
