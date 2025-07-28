
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { Email } from '@/hooks/useEmails';
import { format } from 'date-fns';

interface EmailListProps {
  emails: Email[];
  onEmailSelect: (email: Email) => void;
  onMarkAsRead: (emailId: string) => void;
  onDeleteEmail: (emailId: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({
  emails,
  onEmailSelect,
  onMarkAsRead,
  onDeleteEmail,
}) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getPreviewText = (email: Email) => {
    return email.body_text || email.body_html?.replace(/<[^>]*>/g, '') || '';
  };

  return (
    <div className="space-y-2">
      {emails.map((email) => (
        <Card 
          key={email.id} 
          className={`cursor-pointer hover:shadow-md transition-shadow ${
            !email.is_read ? 'border-l-4 border-l-primary bg-muted/20' : ''
          }`}
          onClick={() => onEmailSelect(email)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {email.is_read ? (
                    <MailOpen className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Mail className="h-4 w-4 text-primary" />
                  )}
                  <p className="text-sm font-medium text-foreground truncate">
                    {email.sender || 'Unknown Sender'}
                  </p>
                  {email.received_date && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(email.received_date), 'MMM dd, HH:mm')}
                    </span>
                  )}
                </div>
                <CardTitle className="text-base font-medium text-foreground truncate">
                  {email.subject || 'No Subject'}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {!email.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(email.id);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <MailOpen className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEmail(email.id);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {truncateText(getPreviewText(email), 150)}
            </p>
            {email.labels.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {email.labels.slice(0, 3).map((label) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
                {email.labels.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{email.labels.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmailList;
