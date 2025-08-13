
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, MailOpen } from 'lucide-react';
import { Email } from '@/hooks/useEmails';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';

interface EmailViewerProps {
  email: Email;
  onBack: () => void;
  onMarkAsRead: (emailId: string) => void;
  onDeleteEmail: (emailId: string) => void;
}

const EmailViewer: React.FC<EmailViewerProps> = ({
  email,
  onBack,
  onMarkAsRead,
  onDeleteEmail,
}) => {
  const displayContent = email.body_html || email.body_text || 'No content available';
  const sanitizedHtml = email.body_html ? DOMPurify.sanitize(email.body_html) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inbox
        </Button>
        <div className="flex items-center gap-2">
          {!email.is_read && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkAsRead(email.id)}
              className="flex items-center gap-2"
            >
              <MailOpen className="h-4 w-4" />
              Mark as Read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteEmail(email.id)}
            className="flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-xl">{email.subject || 'No Subject'}</CardTitle>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>
                <p><strong>From:</strong> {email.sender || 'Unknown Sender'}</p>
                <p><strong>To:</strong> {email.recipient || 'Unknown Recipient'}</p>
              </div>
              {email.received_date && (
                <p>
                  {format(new Date(email.received_date), 'PPP at p')}
                </p>
              )}
            </div>
            {email.labels.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {email.labels.map((label) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {email.body_html && sanitizedHtml ? (
              <div 
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                className="email-content"
              />
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {email.body_text || 'No content available'}
              </pre>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailViewer;
