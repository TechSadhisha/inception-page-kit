ALTER TABLE gmail_sync_status
ADD CONSTRAINT gmail_sync_status_user_id_unique UNIQUE (user_id);