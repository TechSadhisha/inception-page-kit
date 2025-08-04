
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface KnowledgeVideo {
  id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
  tags?: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useKnowledgeBase = () => {
  const [videos, setVideos] = useState<KnowledgeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('knowledge_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos((data || []) as KnowledgeVideo[]);
    } catch (error) {
      console.error('Error fetching knowledge videos:', error);
      toast({
        title: 'Error',
        description: 'Failed to load knowledge base videos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addVideo = async (videoData: Partial<KnowledgeVideo>) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_videos')
        .insert([
          {
            title: videoData.title!,
            url: videoData.url!,
            description: videoData.description,
            category: videoData.category,
            tags: videoData.tags || [],
            user_id: user?.id!,
          },
        ])
        .select()
        .maybeSingle();

      if (error) throw error;
      
      setVideos(prev => [data as KnowledgeVideo, ...prev]);
      toast({
        title: 'Success',
        description: 'Video added to knowledge base',
      });
      
      return data;
    } catch (error) {
      console.error('Error adding video:', error);
      toast({
        title: 'Error',
        description: 'Failed to add video to knowledge base',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateVideo = async (id: string, videoData: Partial<KnowledgeVideo>) => {
    try {
      const { data, error } = await supabase
        .from('knowledge_videos')
        .update({
          title: videoData.title,
          url: videoData.url,
          description: videoData.description,
          category: videoData.category,
          tags: videoData.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) throw error;
      
      setVideos(prev => prev.map(video => video.id === id ? data as KnowledgeVideo : video));
      toast({
        title: 'Success',
        description: 'Video updated successfully',
      });
      
      return data;
    } catch (error) {
      console.error('Error updating video:', error);
      toast({
        title: 'Error',
        description: 'Failed to update video',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setVideos(prev => prev.filter(video => video.id !== id));
      toast({
        title: 'Success',
        description: 'Video deleted from knowledge base',
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete video',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  return {
    videos,
    isLoading,
    addVideo,
    updateVideo,
    deleteVideo,
    refetch: fetchVideos,
  };
};
