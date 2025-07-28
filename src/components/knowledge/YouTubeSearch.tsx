
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  channelTitle: string;
  publishedAt: string;
}

interface YouTubeSearchProps {
  onAddVideo: (videoData: {
    title: string;
    url: string;
    description: string;
    category?: string;
    tags?: string[];
  }) => void;
}

const YouTubeSearch = ({ onAddVideo }: YouTubeSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load API key from database on component mount
  useEffect(() => {
    const loadApiKey = async () => {
      if (!user?.id) {
        setIsLoading(false);
        setShowApiKeyInput(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('youtube_api_key')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data?.youtube_api_key) {
          setApiKey(data.youtube_api_key);
          setShowApiKeyInput(false);
        } else {
          setShowApiKeyInput(true);
        }
      } catch (error) {
        console.error('Error loading YouTube API key:', error);
        setShowApiKeyInput(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKey();
  }, [user?.id]);

  // Save API key to database
  const handleApiKeySave = async () => {
    if (!apiKey.trim() || !user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ youtube_api_key: apiKey.trim() })
        .eq('id', user.id);

      if (error) throw error;

      setShowApiKeyInput(false);
      toast({
        title: 'API Key Saved',
        description: 'Your YouTube API key has been saved to your account',
      });
    } catch (error) {
      console.error('Error saving YouTube API key:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save YouTube API key. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Clear saved API key from database
  const handleClearApiKey = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ youtube_api_key: null })
        .eq('id', user.id);

      if (error) throw error;

      setApiKey('');
      setShowApiKeyInput(true);
      setSearchResults([]);
      toast({
        title: 'API Key Cleared',
        description: 'Your YouTube API key has been removed from your account',
      });
    } catch (error) {
      console.error('Error clearing YouTube API key:', error);
      toast({
        title: 'Clear Failed',
        description: 'Failed to clear YouTube API key. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const searchYouTubeVideos = async () => {
    if (!searchQuery.trim()) return;
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your YouTube API key to search videos',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(
          searchQuery
        )}&type=video&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to search YouTube videos');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'YouTube API error');
      }

      const videos: YouTubeVideo[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      }));

      setSearchResults(videos);
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      toast({
        title: 'Search Failed',
        description: error instanceof Error ? error.message : 'Failed to search YouTube videos',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddVideo = (video: YouTubeVideo) => {
    onAddVideo({
      title: video.title,
      url: video.url,
      description: video.description.substring(0, 500) + (video.description.length > 500 ? '...' : ''),
      category: 'Training',
      tags: [video.channelTitle],
    });

    toast({
      title: 'Video Added',
      description: `"${video.title}" has been added to your knowledge base`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading your YouTube API key...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showApiKeyInput && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">YouTube API Key Required</CardTitle>
            <CardDescription className="text-yellow-700">
              To search YouTube videos, you need to enter your YouTube Data API v3 key. 
              You can get one from the Google Cloud Console.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter your YouTube API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleApiKeySave}
                disabled={!apiKey.trim()}
              >
                Save Key
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Search YouTube videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchYouTubeVideos()}
          className="flex-1"
        />
        <Button 
          onClick={searchYouTubeVideos} 
          disabled={isSearching || !apiKey.trim()}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {!showApiKeyInput && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowApiKeyInput(true)}
          >
            Change API Key
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearApiKey}
          >
            Clear API Key
          </Button>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="aspect-video bg-muted rounded-md overflow-hidden mb-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-sm line-clamp-2">{video.title}</CardTitle>
                <CardDescription className="text-xs">
                  <Badge variant="outline" className="mb-1">
                    {video.channelTitle}
                  </Badge>
                  <div className="line-clamp-2 mt-1">
                    {video.description.substring(0, 100)}...
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddVideo(video)}
                    className="flex-1 flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add to KB
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Watch
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default YouTubeSearch;
