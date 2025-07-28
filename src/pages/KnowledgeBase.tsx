import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Video, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import VideoDialog from '@/components/knowledge/VideoDialog';
import YouTubeSearch from '@/components/knowledge/YouTubeSearch';

const KnowledgeBase = () => {
  const { videos, isLoading, addVideo, updateVideo, deleteVideo } = useKnowledgeBase();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          video.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [videos, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const cats = videos.reduce((acc, video) => {
      if (video.category && !acc.includes(video.category)) {
        acc.push(video.category);
      }
      return acc;
    }, []);
    return ['all', ...cats];
  }, [videos]);

  const handleAddVideo = async (videoData) => {
    await addVideo(videoData);
    setIsDialogOpen(false);
  };

  const handleUpdateVideo = async (videoData) => {
    await updateVideo(editingVideo.id, videoData);
    setEditingVideo(null);
    setIsDialogOpen(false);
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setIsDialogOpen(true);
  };

  const handleDeleteVideo = async (videoId) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await deleteVideo(videoId);
    }
  };

  const handleAddFromSearch = async (videoData) => {
    await addVideo(videoData);
  };

  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading knowledge base...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground">Search YouTube and save training videos for future reference</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Video
        </Button>
      </div>

      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saved">Saved Videos ({videos.length})</TabsTrigger>
          <TabsTrigger value="search">Search YouTube</TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos, descriptions, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-muted rounded-md overflow-hidden mb-3">
                    {getYouTubeThumbnail(video.url) ? (
                      <img
                        src={getYouTubeThumbnail(video.url)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVideo(video)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {video.description && (
                    <CardDescription className="line-clamp-2">
                      {video.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {video.category && (
                      <Badge variant="secondary">{video.category}</Badge>
                    )}
                    {video.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="default"
                      size="sm"
                      className="flex-1"
                    >
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Watch Video
                      </a>
                    </Button>
                  </div>
                  {video.created_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Added {new Date(video.created_at).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No videos found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Start building your knowledge base by adding training videos'}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Video
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <YouTubeSearch onAddVideo={handleAddFromSearch} />
        </TabsContent>
      </Tabs>

      <VideoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={editingVideo ? handleUpdateVideo : handleAddVideo}
        video={editingVideo}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingVideo(null);
        }}
      />
    </div>
  );
};

export default KnowledgeBase;
