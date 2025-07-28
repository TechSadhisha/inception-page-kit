-- Add youtube_api_key column to profiles table to store per-user YouTube API keys
ALTER TABLE profiles 
ADD COLUMN youtube_api_key TEXT;