ALTER TABLE emails
ADD CONSTRAINT emails_gmail_message_id_unique UNIQUE (gmail_message_id);