
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface CampaignImageUploadProps {
  images: File[]
  onImagesChange: (images: File[]) => void
  maxImages?: number
}

export const CampaignImageUpload = ({ images, onImagesChange, maxImages = 5 }: CampaignImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (images.length + imageFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`)
      return
    }

    onImagesChange([...images, ...imageFiles])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Ad Creative Images *</Label>
        <span className="text-sm text-muted-foreground">
          {images.length}/{maxImages} images
        </span>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-2">
              <div className="aspect-square relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 truncate">
                {image.name}
              </p>
            </CardContent>
          </Card>
        ))}

        {images.length < maxImages && (
          <Card 
            className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={triggerFileSelect}
          >
            <CardContent className="p-4">
              <div className="aspect-square flex flex-col items-center justify-center text-muted-foreground">
                <Upload className="h-8 w-8 mb-2" />
                <p className="text-sm text-center">
                  Click to upload
                </p>
                <p className="text-xs text-center mt-1">
                  JPG, PNG up to 10MB
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p className="font-medium mb-1">Meta Ad Image Requirements:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Recommended size: 1200 x 628 pixels</li>
          <li>Aspect ratio: 1.91:1 for feed ads</li>
          <li>File format: JPG or PNG</li>
          <li>Maximum file size: 30MB</li>
          <li>Text in image should be minimal (less than 20%)</li>
        </ul>
      </div>
    </div>
  )
}
