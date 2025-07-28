
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, FileText, Image, Video, File } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface FileUploadProps {
  type: 'transcript' | 'media'
  projectId?: string
  prospectId?: string
  onUploadComplete?: () => void
}

export const FileUpload = ({ type, projectId, prospectId, onUploadComplete }: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [description, setDescription] = useState('')
  const [mediaType, setMediaType] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="h-4 w-4" />
    }
    if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) {
      return <Video className="h-4 w-4" />
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(extension || '')) {
      return <FileText className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const uploadFiles = async () => {
    if (!user || files.length === 0) return

    setUploading(true)
    
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
        const bucket = type === 'transcript' ? 'transcripts' : 'media'
        const filePath = `${projectId || prospectId}/${fileName}`

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Save metadata to database
        if (type === 'transcript' && prospectId) {
          const { error: dbError } = await supabase
            .from('transcripts')
            .insert({
              prospect_id: prospectId,
              file_name: file.name,
              file_path: filePath,
              uploaded_by: user.id,
            })

          if (dbError) throw dbError
        } else if (type === 'media' && projectId) {
          const { error: dbError } = await supabase
            .from('site_media')
            .insert({
              project_id: projectId,
              file_name: file.name,
              file_path: filePath,
              media_type: mediaType || 'document',
              description: description,
              uploaded_by: user.id,
            })

          if (dbError) throw dbError
        }
      }

      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`,
      })

      // Reset form
      setFiles([])
      setDescription('')
      setMediaType('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      onUploadComplete?.()
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload {type === 'transcript' ? 'Transcript' : 'Media'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Select Files</Label>
          <Input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept={type === 'transcript' ? '.pdf,.doc,.docx,.txt,.mp3,.wav,.m4a' : 'image/*,video/*,.pdf'}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Files</Label>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.name)}
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {type === 'media' && (
          <>
            <div>
              <Label htmlFor="media-type">Media Type</Label>
              <Select value={mediaType} onValueChange={setMediaType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
              />
            </div>
          </>
        )}

        <Button
          onClick={uploadFiles}
          disabled={files.length === 0 || uploading || !user}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : `Upload ${files.length} file(s)`}
        </Button>
      </CardContent>
    </Card>
  )
}
