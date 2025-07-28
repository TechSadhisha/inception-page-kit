
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Download, Eye, Trash2, Search, FileText, Image, Video, File } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface FileItem {
  id: string
  file_name: string
  file_path: string
  created_at: string
  description?: string
  media_type?: string
}

interface FileListProps {
  files: FileItem[]
  type: 'transcript' | 'media'
  onDelete?: (id: string) => void
  onRefresh?: () => void
}

export const FileList = ({ files, type, onDelete, onRefresh }: FileListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const filteredFiles = files.filter(file =>
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFileIcon = (fileName: string, mediaType?: string) => {
    if (mediaType === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileName.split('.').pop()?.toLowerCase() || '')) {
      return <Image className="h-4 w-4" />
    }
    if (mediaType === 'video' || ['mp4', 'avi', 'mov', 'wmv'].includes(fileName.split('.').pop()?.toLowerCase() || '')) {
      return <Video className="h-4 w-4" />
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(fileName.split('.').pop()?.toLowerCase() || '')) {
      return <FileText className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const bucket = type === 'transcript' ? 'transcripts' : 'media'
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(filePath)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "File downloaded successfully",
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      })
    }
  }

  const viewFile = async (filePath: string) => {
    try {
      const bucket = type === 'transcript' ? 'transcripts' : 'media'
      const { data } = await supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      if (data.publicUrl) {
        window.open(data.publicUrl, '_blank')
      }
    } catch (error) {
      console.error('View error:', error)
      toast({
        title: "Error",
        description: "Failed to view file",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string, filePath: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return

    try {
      const bucket = type === 'transcript' ? 'transcripts' : 'media'
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (storageError) throw storageError

      // Delete from database
      const tableName = type === 'transcript' ? 'transcripts' : 'site_media'
      const { error: dbError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      toast({
        title: "Success",
        description: "File deleted successfully",
      })

      onDelete?.(id)
      onRefresh?.()
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {type === 'transcript' ? 'Transcripts' : 'Media Files'}
          <Badge variant="secondary">{files.length} files</Badge>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredFiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No files match your search' : 'No files uploaded yet'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file.file_name, file.media_type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.file_name}</p>
                    {file.description && (
                      <p className="text-sm text-muted-foreground truncate">{file.description}</p>
                    )}
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{format(new Date(file.created_at), 'MMM dd, yyyy')}</span>
                      {file.media_type && (
                        <Badge variant="outline" className="text-xs">
                          {file.media_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewFile(file.file_path)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(file.file_path, file.file_name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id, file.file_path)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
